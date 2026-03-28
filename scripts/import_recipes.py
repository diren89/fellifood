#!/usr/bin/env python3
"""
FelliFood Recipe Importer
Fetches ~300 recipes from TheMealDB, translates to German via Claude,
downloads images, supplements to 500 with german_supplements.json,
and writes js/data.js.

Usage:
  export ANTHROPIC_API_KEY=sk-ant-...
  pip3 install requests anthropic
  python3 scripts/import_recipes.py
"""

import json
import os
import re
import sys
import time
from pathlib import Path

import requests

# ─── Paths ────────────────────────────────────────────────────────────────────
ROOT       = Path(__file__).parent.parent
SCRIPTS    = ROOT / 'scripts'
CACHE      = SCRIPTS / 'cache'
IMAGES_DIR = ROOT / 'images' / 'recipes'
DATA_JS    = ROOT / 'js' / 'data.js'
SUPPLEMENTS = SCRIPTS / 'german_supplements.json'

CACHE.mkdir(exist_ok=True)
(CACHE / 'meals_raw').mkdir(exist_ok=True)
(CACHE / 'translated').mkdir(exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# ─── Config ───────────────────────────────────────────────────────────────────
BASE           = 'https://www.themealdb.com/api/json/v1/1'
TOTAL_TARGET   = 500
BATCH_SIZE     = 15   # recipes per Claude API call

CATEGORIES = [
    'Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 'Pork', 'Seafood',
    'Side', 'Starter', 'Vegan', 'Vegetarian', 'Breakfast', 'Goat', 'Miscellaneous'
]

VALID_LABELS        = {'vegetarisch', 'vegan', 'fleisch'}
VALID_MAHLZEIT      = {'fruehstueck', 'mittagessen', 'abendessen'}
VALID_SCHWIERIGKEIT = {'einfach', 'mittel', 'schwer'}

# ─── Helpers ──────────────────────────────────────────────────────────────────
def kebab(name: str) -> str:
    name = name.lower()
    for a, b in [('ä','ae'), ('ö','oe'), ('ü','ue'), ('ß','ss')]:
        name = name.replace(a, b)
    name = re.sub(r'[^a-z0-9]+', '-', name)
    return name.strip('-')[:60]


def log(msg: str):
    print(msg, flush=True)


# ─── Stage 1: Fetch all meal IDs ──────────────────────────────────────────────
def fetch_all_meal_ids() -> list:
    cache_file = CACHE / 'all_meal_ids.json'
    if cache_file.exists():
        log('[1/6] Meal IDs already fetched, loading from cache.')
        return json.loads(cache_file.read_text())

    log('[1/6] Fetching meal IDs from all categories...')
    seen = {}
    for cat in CATEGORIES:
        try:
            r = requests.get(f'{BASE}/filter.php', params={'c': cat}, timeout=10)
            r.raise_for_status()
            for m in (r.json().get('meals') or []):
                seen[m['idMeal']] = m
            log(f'  {cat}: {len(r.json().get("meals") or [])} meals')
        except Exception as e:
            log(f'  WARNING: Failed to fetch category {cat}: {e}')
        time.sleep(0.3)

    ids = list(seen.values())
    cache_file.write_text(json.dumps(ids, ensure_ascii=False))
    log(f'  Total unique meals: {len(ids)}')
    return ids


# ─── Stage 2: Fetch full meal details ─────────────────────────────────────────
def fetch_meal_detail(id_meal: str) -> dict:
    p = CACHE / 'meals_raw' / f'{id_meal}.json'
    if p.exists():
        return json.loads(p.read_text())
    try:
        r = requests.get(f'{BASE}/lookup.php', params={'i': id_meal}, timeout=10)
        r.raise_for_status()
        data = (r.json().get('meals') or [None])[0]
        if data:
            p.write_text(json.dumps(data, ensure_ascii=False))
        time.sleep(0.2)
        return data
    except Exception as e:
        log(f'  WARNING: Failed to fetch meal {id_meal}: {e}')
        return None


def fetch_all_details(ids: list) -> list:
    log(f'[2/6] Fetching details for {len(ids)} meals...')
    already = len(list((CACHE / 'meals_raw').glob('*.json')))
    if already > 0:
        log(f'  {already} already cached.')

    results = []
    for i, m in enumerate(ids):
        detail = fetch_meal_detail(m['idMeal'])
        if detail:
            results.append(detail)
        if (i + 1) % 50 == 0:
            log(f'  {i+1}/{len(ids)} fetched...')
    log(f'  Done: {len(results)} meals with details.')
    return results


# ─── Stage 3: Translate to German via Claude ──────────────────────────────────
def translate_batch(meals: list) -> list:
    try:
        import anthropic
    except ImportError:
        log('ERROR: anthropic package not installed. Run: pip3 install anthropic')
        sys.exit(1)

    payload = []
    for m in meals:
        zutaten = []
        for i in range(1, 21):
            ingredient = (m.get(f'strIngredient{i}') or '').strip()
            measure    = (m.get(f'strMeasure{i}') or '').strip()
            if ingredient:
                zutaten.append(f'{measure} {ingredient}'.strip())
        payload.append({
            'id':               m['idMeal'],
            'name_en':          m.get('strMeal', ''),
            'instructions_en':  (m.get('strInstructions') or '')[:1500],
            'ingredients_en':   zutaten,
            'category':         m.get('strCategory', ''),
            'area':             m.get('strArea', ''),
        })

    prompt = f"""Du bist ein professioneller Rezeptübersetzer. Übersetze die folgenden Rezepte ins Deutsche und gib NUR ein valides JSON-Array zurück, ohne Erklärungen oder Markdown.

Regeln:
- name: Natürliche deutsche Bezeichnung (z.B. "Hähnchen-Tikka-Masala", nicht "Chicken Tikka Masala")
- beschreibung: Genau 1 appetitlicher Satz auf Deutsch
- zutaten: Array von Strings, metrische Einheiten (g, ml, EL, TL, Stück, Prise, Bund)
- zubereitung: Zubereitungsschritte als Array von Sätzen auf Deutsch (3-8 Schritte)
- label: "vegan" | "vegetarisch" | "fleisch" (basierend auf Zutaten)
- mahlzeit: Array, erlaubte Werte: "fruehstueck", "mittagessen", "abendessen"
- kueche: Küche auf Deutsch (z.B. "italienisch", "indisch", "international", "amerikanisch")
- zeit: Geschätzte Gesamtzeit in Minuten als Integer
- schwierigkeit: "einfach" | "mittel" | "schwer"

Eingabe:
{json.dumps(payload, ensure_ascii=False, indent=2)}

Antworte NUR mit dem JSON-Array. Beispielformat:
[{{"id":"12345","name":"Beispielgericht","beschreibung":"Ein leckeres Gericht.","zutaten":["200 g Nudeln"],"zubereitung":["Nudeln kochen."],"label":"vegetarisch","mahlzeit":["abendessen"],"kueche":"italienisch","zeit":20,"schwierigkeit":"einfach"}}]"""

    api_key = os.environ.get('ANTHROPIC_API_KEY', '')
    if not api_key:
        log('ERROR: ANTHROPIC_API_KEY not set.')
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)
    for attempt in range(3):
        try:
            msg = client.messages.create(
                model='claude-3-5-haiku-20241022',
                max_tokens=8096,
                messages=[{'role': 'user', 'content': prompt}]
            )
            text = msg.content[0].text.strip()
            # Strip markdown fences
            if text.startswith('```'):
                text = text.split('\n', 1)[1]
                text = text.rsplit('```', 1)[0]
            results = json.loads(text)
            # Cache each result
            for t in results:
                p = CACHE / 'translated' / f'{t["id"]}.json'
                p.write_text(json.dumps(t, ensure_ascii=False))
            return results
        except Exception as e:
            log(f'  WARNING: Translation attempt {attempt+1} failed: {e}')
            time.sleep(5)
    return []


def translate_all(raw_meals: list) -> dict:
    log('[3/6] Translating to German (via Claude Haiku)...')
    already = {p.stem for p in (CACHE / 'translated').glob('*.json')}
    log(f'  {len(already)} already translated.')

    untranslated = [m for m in raw_meals if m['idMeal'] not in already]
    log(f'  {len(untranslated)} to translate in batches of {BATCH_SIZE}...')

    for i in range(0, len(untranslated), BATCH_SIZE):
        batch = untranslated[i:i + BATCH_SIZE]
        log(f'  Batch {i//BATCH_SIZE + 1}/{(len(untranslated)-1)//BATCH_SIZE + 1} ({len(batch)} recipes)...')
        translate_batch(batch)
        time.sleep(2)

    # Load all from cache
    result = {}
    for p in (CACHE / 'translated').glob('*.json'):
        result[p.stem] = json.loads(p.read_text())
    log(f'  Total translated: {len(result)}')
    return result


# ─── Stage 4: Download images ─────────────────────────────────────────────────
def download_image(thumb_url: str, german_name: str, id_meal: str) -> str:
    done_file = CACHE / 'images_done.txt'
    done = set()
    if done_file.exists():
        done = set(done_file.read_text().splitlines())

    filename = kebab(german_name) + '.jpg'
    dest     = IMAGES_DIR / filename

    if id_meal not in done:
        try:
            if not dest.exists():
                r = requests.get(thumb_url, timeout=15)
                r.raise_for_status()
                dest.write_bytes(r.content)
            with open(done_file, 'a') as f:
                f.write(id_meal + '\n')
            time.sleep(0.15)
        except Exception as e:
            log(f'  WARNING: Image download failed for {german_name}: {e}')
            return 'images/recipes/placeholder.jpg'

    return f'images/recipes/{filename}'


def download_all_images(raw_meals: list, translations: dict) -> dict:
    log('[4/6] Downloading images...')
    done_file = CACHE / 'images_done.txt'
    already   = set(done_file.read_text().splitlines()) if done_file.exists() else set()
    log(f'  {len(already)} images already downloaded.')

    image_map = {}
    count = 0
    for m in raw_meals:
        id_meal    = m['idMeal']
        thumb_url  = m.get('strMealThumb', '')
        trans      = translations.get(id_meal, {})
        german_name = trans.get('name', m.get('strMeal', id_meal))
        image_map[id_meal] = download_image(thumb_url, german_name, id_meal)
        count += 1
        if count % 50 == 0:
            log(f'  {count}/{len(raw_meals)} images processed...')

    log(f'  Done: {len(image_map)} images.')
    return image_map


# ─── Stage 5: Assemble FelliFood objects ──────────────────────────────────────
FALLBACK_MAHLZEIT = {
    'Breakfast':   ['fruehstueck'],
    'Dessert':     ['abendessen'],
    'Vegan':       ['mittagessen', 'abendessen'],
    'Vegetarian':  ['mittagessen', 'abendessen'],
    'Side':        ['mittagessen'],
    'Starter':     ['mittagessen'],
}
FALLBACK_LABEL = {
    'Vegan':       'vegan',
    'Vegetarian':  'vegetarisch',
    'Breakfast':   'vegetarisch',
    'Dessert':     'vegetarisch',
}


def validate(r: dict) -> list:
    errors = []
    if r.get('label') not in VALID_LABELS:
        errors.append(f'label={r.get("label")}')
    mahlzeit = r.get('mahlzeit', [])
    if not mahlzeit or not all(m in VALID_MAHLZEIT for m in mahlzeit):
        errors.append(f'mahlzeit={mahlzeit}')
    if r.get('schwierigkeit') not in VALID_SCHWIERIGKEIT:
        errors.append(f'schwierigkeit={r.get("schwierigkeit")}')
    try:
        z = int(r.get('zeit', 0))
        if z <= 0: errors.append(f'zeit={z}')
    except:
        errors.append(f'zeit={r.get("zeit")}')
    if not r.get('zutaten') or not isinstance(r.get('zutaten'), list):
        errors.append('zutaten empty')
    if not r.get('zubereitung') or not isinstance(r.get('zubereitung'), list):
        errors.append('zubereitung empty')
    return errors


def fix_recipe(recipe: dict, raw: dict) -> dict:
    """Apply fallbacks for invalid fields."""
    cat = raw.get('strCategory', '')

    if recipe.get('label') not in VALID_LABELS:
        recipe['label'] = FALLBACK_LABEL.get(cat, 'fleisch')

    mahlzeit = recipe.get('mahlzeit', [])
    if not mahlzeit or not all(m in VALID_MAHLZEIT for m in mahlzeit):
        recipe['mahlzeit'] = FALLBACK_MAHLZEIT.get(cat, ['abendessen'])

    if recipe.get('schwierigkeit') not in VALID_SCHWIERIGKEIT:
        recipe['schwierigkeit'] = 'mittel'

    try:
        recipe['zeit'] = max(1, int(recipe.get('zeit', 30)))
    except:
        recipe['zeit'] = 30

    if not recipe.get('name'):
        recipe['name'] = raw.get('strMeal', 'Unbekanntes Gericht')

    if not recipe.get('description'):
        recipe['description'] = f'Ein leckeres Gericht aus der {recipe.get("kueche","internationalen")} Küche.'

    if not recipe.get('zutaten') or not isinstance(recipe.get('zutaten'), list):
        recipe['zutaten'] = ['Zutaten nach Bedarf']

    if not recipe.get('zubereitung') or not isinstance(recipe.get('zubereitung'), list):
        recipe['zubereitung'] = ['Zubereitung nach Rezept.']

    if not recipe.get('kueche'):
        recipe['kueche'] = 'international'

    return recipe


def assemble_mealdb_recipes(raw_meals: list, translations: dict, image_map: dict) -> list:
    log('[5/6] Assembling FelliFood recipe objects...')
    recipes = []
    errors_log = []

    for i, raw in enumerate(raw_meals):
        id_meal = raw['idMeal']
        trans   = translations.get(id_meal)
        if not trans:
            log(f'  SKIP: No translation for meal {id_meal}')
            continue

        recipe = {
            'name':          trans.get('name', raw.get('strMeal', '')),
            'description':   trans.get('beschreibung', ''),
            'label':         trans.get('label', ''),
            'mahlzeit':      trans.get('mahlzeit', []),
            'kueche':        trans.get('kueche', ''),
            'zeit':          trans.get('zeit', 30),
            'schwierigkeit': trans.get('schwierigkeit', 'mittel'),
            'zutaten':       trans.get('zutaten', []),
            'zubereitung':   trans.get('zubereitung', []),
            'image':         image_map.get(id_meal, 'images/recipes/placeholder.jpg'),
        }

        errs = validate(recipe)
        if errs:
            recipe = fix_recipe(recipe, raw)
            errs2 = validate(recipe)
            if errs2:
                errors_log.append(f'{id_meal} ({recipe["name"]}): {errs2}')

        recipes.append(recipe)

    if errors_log:
        (CACHE / 'validation_errors.txt').write_text('\n'.join(errors_log))
        log(f'  {len(errors_log)} recipes had validation issues (auto-fixed where possible). See cache/validation_errors.txt')

    log(f'  {len(recipes)} TheMealDB recipes assembled.')
    return recipes


def load_supplements() -> list:
    if not SUPPLEMENTS.exists():
        log('  WARNING: german_supplements.json not found — skipping supplements.')
        return []
    items = json.loads(SUPPLEMENTS.read_text())
    log(f'  Loaded {len(items)} supplement recipes.')
    return items


def assemble_all(raw_meals: list, translations: dict, image_map: dict) -> list:
    mealdb_recipes = assemble_mealdb_recipes(raw_meals, translations, image_map)
    supplements    = load_supplements()

    # Deduplicate supplements by name against mealdb_recipes
    mealdb_names = {r['name'].lower() for r in mealdb_recipes}
    unique_suppl  = [s for s in supplements if s.get('name', '').lower() not in mealdb_names]
    log(f'  {len(unique_suppl)} unique supplements after dedup.')

    all_recipes = mealdb_recipes + unique_suppl
    needed      = max(0, TOTAL_TARGET - len(all_recipes))
    if needed > 0:
        log(f'  NOTE: {len(all_recipes)} recipes total, {needed} below target of {TOTAL_TARGET}.')
    else:
        log(f'  Capping to {TOTAL_TARGET} (have {len(all_recipes)}).')
        all_recipes = all_recipes[:TOTAL_TARGET]

    # Assign IDs
    for i, r in enumerate(all_recipes):
        r['id']        = f'r{i+1}'
        r['bewertung'] = 0
        r['notizen']   = ''

    log(f'  Final count: {len(all_recipes)} recipes.')
    return all_recipes


# ─── Stage 6: Write data.js ───────────────────────────────────────────────────
def recipe_to_js(r: dict) -> str:
    lines = [
        '  {',
        f"    id: '{r['id']}',",
        f"    name: {json.dumps(r['name'], ensure_ascii=False)},",
        f"    description: {json.dumps(r['description'], ensure_ascii=False)},",
        f"    label: '{r['label']}',",
        f"    mahlzeit: {json.dumps(r['mahlzeit'])},",
        f"    kueche: {json.dumps(r['kueche'], ensure_ascii=False)},",
        f"    zeit: {int(r['zeit'])},",
        f"    schwierigkeit: '{r['schwierigkeit']}',",
        f"    zutaten: {json.dumps(r['zutaten'], ensure_ascii=False)},",
        f"    zubereitung: {json.dumps(r['zubereitung'], ensure_ascii=False)},",
        f"    image: '{r['image']}',",
        f"    bewertung: 0,",
        f"    notizen: ''",
        '  }',
    ]
    return '\n'.join(lines)


def write_data_js(recipes: list):
    log('[6/6] Writing js/data.js...')
    existing = DATA_JS.read_text(encoding='utf-8')

    SPLIT_MARKER = '];\n\n// ─── State Management'
    if SPLIT_MARKER not in existing:
        log('ERROR: Could not find split marker in data.js. Aborting.')
        sys.exit(1)

    _, footer = existing.split(SPLIT_MARKER, 1)

    recipe_blocks = ',\n\n'.join(recipe_to_js(r) for r in recipes)
    new_content = (
        '// ─── Initial Recipe Data ─────────────────────────────────────────────────────\n'
        'const INITIAL_RECIPES = [\n\n'
        + recipe_blocks
        + '\n\n'
        + SPLIT_MARKER
        + footer
    )

    DATA_JS.write_text(new_content, encoding='utf-8')
    log(f'  Done. {len(recipes)} recipes written to js/data.js.')


# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    log('═' * 60)
    log('FelliFood Recipe Importer')
    log('═' * 60)

    # Check API key early
    if not os.environ.get('ANTHROPIC_API_KEY'):
        log('ERROR: ANTHROPIC_API_KEY environment variable not set.')
        log('  export ANTHROPIC_API_KEY=sk-ant-...')
        sys.exit(1)

    # Check cache for assembled recipes (allows skipping stages 1-5)
    assembled_cache = CACHE / 'assembled_recipes.json'
    if assembled_cache.exists():
        log('Found assembled_recipes.json cache — loading directly.')
        recipes = json.loads(assembled_cache.read_text())
        log(f'  {len(recipes)} recipes loaded from cache.')
    else:
        # Stage 1
        ids = fetch_all_meal_ids()

        # Stage 2
        raw_meals = fetch_all_details(ids)

        # Stage 3
        translations = translate_all(raw_meals)

        # Stage 4
        image_map = download_all_images(raw_meals, translations)

        # Stage 5
        recipes = assemble_all(raw_meals, translations, image_map)

        assembled_cache.write_text(json.dumps(recipes, ensure_ascii=False, indent=2))

    # Stage 6
    write_data_js(recipes)

    log('═' * 60)
    log(f'SUCCESS: {len(recipes)} recipes imported.')
    log('Next steps:')
    log('  1. Open browser DevTools → localStorage.removeItem("fellifood_state") → reload')
    log('  2. git add js/data.js images/recipes/ && git commit -m "v0.3.0 — 500 Rezepte"')
    log('═' * 60)


if __name__ == '__main__':
    main()
