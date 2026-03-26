#!/usr/bin/env python3
"""
FelliFood Offline Recipe Importer
Verarbeitet die gecachten TheMealDB-Daten ohne Claude-API.
Übersetzt via eingebautem Wörterbuch, lädt Bilder direkt herunter.

Usage:
  cd /Users/christian.fellenstein/Documents/GitHub/fellifood
  python3 scripts/import_offline.py
"""

import json
import os
import re
import sys
import time
import unicodedata
from pathlib import Path
import urllib.request
import urllib.error

ROOT       = Path(__file__).parent.parent
SCRIPTS    = ROOT / 'scripts'
CACHE      = SCRIPTS / 'cache'
IMAGES_DIR = ROOT / 'images' / 'recipes'
DATA_JS    = ROOT / 'js' / 'data.js'
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

TOTAL_TARGET = 500

# ─── Name translations (EN → DE) ─────────────────────────────────────────────
NAME_MAP = {
    'Chicken': 'Hähnchen', 'Beef': 'Rind', 'Pork': 'Schwein', 'Lamb': 'Lamm',
    'Fish': 'Fisch', 'Salmon': 'Lachs', 'Tuna': 'Thunfisch', 'Shrimp': 'Garnelen',
    'Prawn': 'Garnelen', 'Lobster': 'Hummer', 'Crab': 'Krabbe', 'Seafood': 'Meeresfrüchte',
    'Turkey': 'Pute', 'Duck': 'Ente', 'Goat': 'Ziege', 'Veal': 'Kalbfleisch',
    'Pasta': 'Pasta', 'Spaghetti': 'Spaghetti', 'Lasagna': 'Lasagne', 'Lasagne': 'Lasagne',
    'Risotto': 'Risotto', 'Pizza': 'Pizza', 'Soup': 'Suppe', 'Stew': 'Eintopf',
    'Salad': 'Salat', 'Cake': 'Kuchen', 'Bread': 'Brot', 'Pancakes': 'Pfannkuchen',
    'Omelette': 'Omelette', 'Omelette': 'Omelett', 'Eggs': 'Eier', 'Rice': 'Reis',
    'Curry': 'Curry', 'Masala': 'Masala', 'Biryani': 'Biryani', 'Kebab': 'Kebab',
    'Burger': 'Burger', 'Sandwich': 'Sandwich', 'Wrap': 'Wrap', 'Tacos': 'Tacos',
    'Nachos': 'Nachos', 'Enchiladas': 'Enchiladas', 'Fajitas': 'Fajitas',
    'Chili': 'Chili', 'Stir Fry': 'Pfannengericht', 'Fried': 'Gebratenes',
    'Grilled': 'Gegrilltes', 'Baked': 'Gebackenes', 'Roast': 'Braten',
    'Roasted': 'Gebratener', 'Smoked': 'Geräuchert', 'Stuffed': 'Gefülltes',
    'Creamy': 'Cremiges', 'Spicy': 'Würziges', 'Sweet': 'Süßes',
    'Honey': 'Honig', 'Garlic': 'Knoblauch', 'Lemon': 'Zitronen',
    'Mushroom': 'Pilz', 'Mushrooms': 'Pilze', 'Tomato': 'Tomaten',
    'Potato': 'Kartoffel', 'Potatoes': 'Kartoffeln', 'Cheese': 'Käse',
    'Bacon': 'Speck', 'Ham': 'Schinken', 'Sausage': 'Wurst',
    'Meatballs': 'Fleischbällchen', 'Meatloaf': 'Hackbraten',
    'Brownies': 'Brownies', 'Cookies': 'Kekse', 'Pie': 'Pie', 'Tart': 'Törtchen',
    'Mousse': 'Mousse', 'Pudding': 'Pudding', 'Ice Cream': 'Eis',
    'Smoothie': 'Smoothie', 'Juice': 'Saft',
    'with': 'mit', 'and': 'und', 'in': 'in', 'on': 'auf',
}

# ─── Cuisine area → German ───────────────────────────────────────────────────
AREA_MAP = {
    'American': 'amerikanisch', 'British': 'britisch', 'Canadian': 'kanadisch',
    'Chinese': 'chinesisch', 'Croatian': 'kroatisch', 'Dutch': 'niederländisch',
    'Egyptian': 'ägyptisch', 'Filipino': 'philippinisch', 'French': 'französisch',
    'German': 'deutsch', 'Greek': 'griechisch', 'Indian': 'indisch',
    'Irish': 'irisch', 'Italian': 'italienisch', 'Jamaican': 'jamaikanisch',
    'Japanese': 'japanisch', 'Kenyan': 'kenianisch', 'Malaysian': 'malaysisch',
    'Mexican': 'mexikanisch', 'Moroccan': 'marokkanisch', 'Polish': 'polnisch',
    'Portuguese': 'portugiesisch', 'Russian': 'russisch', 'Spanish': 'spanisch',
    'Thai': 'thailändisch', 'Tunisian': 'tunesisch', 'Turkish': 'türkisch',
    'Ukrainian': 'ukrainisch', 'Uruguayan': 'uruguayisch', 'Vietnamese': 'vietnamesisch',
    'Unknown': 'international',
}

# ─── Category → Mahlzeit / Label fallbacks ───────────────────────────────────
CAT_MAHLZEIT = {
    'Breakfast': ['fruehstueck'],
    'Dessert':   ['abendessen'],
    'Starter':   ['mittagessen'],
    'Side':      ['mittagessen'],
    'Vegan':     ['mittagessen', 'abendessen'],
    'Vegetarian':['mittagessen', 'abendessen'],
}
CAT_LABEL = {
    'Vegan':       'vegan',
    'Vegetarian':  'vegetarisch',
    'Breakfast':   'vegetarisch',
    'Dessert':     'vegetarisch',
    'Pasta':       'vegetarisch',
}

# ─── Ingredient translations ──────────────────────────────────────────────────
ING_MAP = {
    'chicken breast': 'Hähnchenbrust', 'chicken thigh': 'Hähnchenschenkel',
    'chicken': 'Hähnchen', 'beef': 'Rindfleisch', 'ground beef': 'Hackfleisch',
    'minced beef': 'Rinderhack', 'pork': 'Schweinefleisch', 'lamb': 'Lammfleisch',
    'bacon': 'Speckstreifen', 'ham': 'Schinken', 'sausage': 'Bratwurst',
    'salmon': 'Lachs', 'tuna': 'Thunfisch', 'shrimp': 'Garnelen', 'prawns': 'Garnelen',
    'onion': 'Zwiebel', 'garlic': 'Knoblauch', 'tomato': 'Tomate', 'tomatoes': 'Tomaten',
    'potato': 'Kartoffel', 'potatoes': 'Kartoffeln', 'carrot': 'Karotte',
    'carrots': 'Karotten', 'celery': 'Sellerie', 'leek': 'Lauch',
    'mushroom': 'Champignons', 'mushrooms': 'Champignons', 'spinach': 'Spinat',
    'broccoli': 'Brokkoli', 'pepper': 'Paprika', 'bell pepper': 'Paprikaschote',
    'courgette': 'Zucchini', 'zucchini': 'Zucchini', 'eggplant': 'Aubergine',
    'aubergine': 'Aubergine', 'cucumber': 'Gurke', 'lettuce': 'Salat',
    'cabbage': 'Kohl', 'cauliflower': 'Blumenkohl',
    'olive oil': 'Olivenöl', 'butter': 'Butter', 'oil': 'Öl',
    'flour': 'Mehl', 'sugar': 'Zucker', 'salt': 'Salz', 'pepper': 'Pfeffer',
    'egg': 'Ei', 'eggs': 'Eier', 'milk': 'Milch', 'cream': 'Sahne',
    'cheese': 'Käse', 'parmesan': 'Parmesan', 'mozzarella': 'Mozzarella',
    'cheddar': 'Cheddar', 'feta': 'Feta', 'yogurt': 'Joghurt', 'yoghurt': 'Joghurt',
    'rice': 'Reis', 'pasta': 'Pasta', 'noodles': 'Nudeln', 'spaghetti': 'Spaghetti',
    'bread': 'Brot', 'breadcrumbs': 'Semmelbrösel',
    'lemon': 'Zitrone', 'lime': 'Limette', 'orange': 'Orange',
    'tomato paste': 'Tomatenmark', 'tomato sauce': 'Tomatensauce',
    'soy sauce': 'Sojasoße', 'fish sauce': 'Fischsauce', 'oyster sauce': 'Austernsauce',
    'worcestershire sauce': 'Worcestershiresauce', 'hot sauce': 'scharfe Soße',
    'stock': 'Brühe', 'broth': 'Brühe', 'chicken stock': 'Hühnerbrühe',
    'beef stock': 'Rinderbrühe', 'vegetable stock': 'Gemüsebrühe',
    'white wine': 'Weißwein', 'red wine': 'Rotwein', 'wine': 'Wein',
    'honey': 'Honig', 'maple syrup': 'Ahornsirup', 'vanilla': 'Vanille',
    'cinnamon': 'Zimt', 'cumin': 'Kreuzkümmel', 'turmeric': 'Kurkuma',
    'paprika': 'Paprikapulver', 'chili': 'Chili', 'ginger': 'Ingwer',
    'coriander': 'Koriander', 'parsley': 'Petersilie', 'basil': 'Basilikum',
    'thyme': 'Thymian', 'rosemary': 'Rosmarin', 'oregano': 'Oregano',
    'bay leaves': 'Lorbeerblätter', 'mint': 'Minze',
    'almonds': 'Mandeln', 'walnuts': 'Walnüsse', 'pine nuts': 'Pinienkerne',
    'sesame seeds': 'Sesamsamen', 'sesame': 'Sesam',
    'chickpeas': 'Kichererbsen', 'lentils': 'Linsen', 'beans': 'Bohnen',
    'black beans': 'schwarze Bohnen', 'kidney beans': 'Kidneybohnen',
    'coconut milk': 'Kokosmilch', 'coconut': 'Kokosnuss',
    'baking powder': 'Backpulver', 'baking soda': 'Natron',
    'chocolate': 'Schokolade', 'cocoa': 'Kakao',
}

UNIT_MAP = {
    'tbs': 'EL', 'tbsp': 'EL', 'tablespoon': 'EL', 'tablespoons': 'EL',
    'tsp': 'TL', 'teaspoon': 'TL', 'teaspoons': 'TL',
    'cup': '240 ml', 'cups': 'Tassen',
    'oz': 'g', 'lb': 'g', 'lbs': 'g',
    'bunch': 'Bund', 'handful': 'Handvoll', 'handful ': 'Handvoll',
    'pinch': 'Prise', 'dash': 'Spritzer', 'to taste': 'nach Geschmack',
    'clove': 'Zehe', 'cloves': 'Zehen', 'slice': 'Scheibe', 'slices': 'Scheiben',
    'large': 'große', 'medium': 'mittelgroße', 'small': 'kleine',
    'g': 'g', 'kg': 'kg', 'ml': 'ml', 'l': 'l',
}


def kebab(name: str) -> str:
    name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode()
    name = name.lower()
    name = re.sub(r'[^a-z0-9]+', '-', name)
    return name.strip('-')[:60]


def translate_name(en_name: str) -> str:
    """Best-effort English → German recipe name."""
    result = en_name
    for en, de in sorted(NAME_MAP.items(), key=lambda x: -len(x[0])):
        result = re.sub(r'\b' + re.escape(en) + r'\b', de, result, flags=re.IGNORECASE)
    return result


def translate_ingredient(raw_ing: str, raw_measure: str) -> str:
    """Translate a single ingredient line."""
    combined = f"{raw_measure} {raw_ing}".strip()

    # Translate ingredient name
    ing_lower = raw_ing.lower().strip()
    for en, de in sorted(ING_MAP.items(), key=lambda x: -len(x[0])):
        if ing_lower == en or ing_lower.startswith(en + ' ') or ing_lower.endswith(' ' + en):
            combined = combined.replace(raw_ing, de)
            break

    # Translate units
    measure_lower = raw_measure.lower().strip()
    for en, de in sorted(UNIT_MAP.items(), key=lambda x: -len(x[0])):
        if measure_lower.endswith(en) or measure_lower == en:
            combined = re.sub(r'\b' + re.escape(en) + r'\b', de, combined, flags=re.IGNORECASE)
            break

    return combined


def determine_label(raw: dict, category: str) -> str:
    if category in CAT_LABEL:
        return CAT_LABEL[category]
    # Scan ingredients for meat
    meat_kw = ['chicken', 'beef', 'pork', 'lamb', 'bacon', 'ham', 'sausage',
               'turkey', 'duck', 'veal', 'mince', 'steak', 'salmon', 'tuna',
               'shrimp', 'prawn', 'seafood', 'fish', 'crab', 'lobster', 'goat']
    ings = ' '.join(
        (raw.get(f'strIngredient{i}') or '').lower()
        for i in range(1, 21)
    )
    if any(k in ings for k in meat_kw):
        return 'fleisch'
    vegan_kw = ['milk', 'cream', 'cheese', 'butter', 'egg', 'honey', 'yogurt', 'yoghurt']
    if any(k in ings for k in vegan_kw):
        return 'vegetarisch'
    return 'vegan'


def determine_mahlzeit(category: str, name: str) -> list:
    if category in CAT_MAHLZEIT:
        return CAT_MAHLZEIT[category]
    n = name.lower()
    if any(k in n for k in ['breakfast', 'porridge', 'pancake', 'waffle', 'muesli', 'granola', 'smoothie']):
        return ['fruehstueck']
    if any(k in n for k in ['soup', 'salad', 'sandwich', 'wrap', 'starter']):
        return ['mittagessen', 'abendessen']
    return ['abendessen']


def estimate_time(raw: dict) -> int:
    instr = (raw.get('strInstructions') or '').lower()
    # Look for time mentions
    for pattern in [r'(\d+)\s*(?:to\s*\d+\s*)?(?:hour|hr)', r'(\d+)\s*(?:to\s*\d+\s*)?min']:
        m = re.search(pattern, instr)
        if m:
            val = int(m.group(1))
            if 'hour' in pattern or 'hr' in pattern:
                return min(val * 60, 180)
            return min(max(val, 10), 120)
    # Fallback by category
    cat_time = {
        'Breakfast': 20, 'Dessert': 45, 'Starter': 25,
        'Side': 25, 'Pasta': 30, 'Vegan': 30, 'Vegetarian': 35,
    }
    cat = raw.get('strCategory', '')
    return cat_time.get(cat, 40)


def difficulty(time_min: int, steps: int) -> str:
    if time_min <= 25 and steps <= 4:
        return 'einfach'
    if time_min >= 90 or steps >= 8:
        return 'schwer'
    return 'mittel'


def build_instructions(raw: dict) -> list:
    """Split English instructions into steps, keep as-is (no translation for now)."""
    text = (raw.get('strInstructions') or '').strip()
    # Split by numbered steps or double-newlines
    steps = re.split(r'\n{2,}|\r\n{2,}|(?<=\.)\s*\n|\b(?:Step\s+\d+[:.]\s*)', text)
    steps = [s.strip() for s in steps if s.strip() and len(s.strip()) > 10]
    if len(steps) > 8:
        steps = steps[:8]
    if not steps:
        steps = [text[:200]] if text else ['Zubereitung nach Anleitung.']
    return steps


def translate_raw_meal(raw: dict) -> dict:
    """Convert a raw TheMealDB meal into a FelliFood recipe dict."""
    category = raw.get('strCategory', '')
    area     = raw.get('strArea', 'Unknown')
    en_name  = raw.get('strMeal', 'Rezept')

    de_name  = translate_name(en_name)
    label    = determine_label(raw, category)
    mahlzeit = determine_mahlzeit(category, en_name)
    kueche   = AREA_MAP.get(area, 'international')
    zeit     = estimate_time(raw)
    steps    = build_instructions(raw)
    schw     = difficulty(zeit, len(steps))

    # Ingredients
    zutaten = []
    for i in range(1, 21):
        ing     = (raw.get(f'strIngredient{i}') or '').strip()
        measure = (raw.get(f'strMeasure{i}') or '').strip()
        if ing:
            zutaten.append(translate_ingredient(ing, measure))

    beschreibung = f"Ein leckeres {de_name} aus der {kueche}en Küche."

    return {
        'name':          de_name,
        'description':   beschreibung,
        'label':         label,
        'mahlzeit':      mahlzeit,
        'kueche':        kueche,
        'zeit':          zeit,
        'schwierigkeit': schw,
        'zutaten':       zutaten or ['Zutaten nach Rezept'],
        'zubereitung':   steps,
        '_thumb':        raw.get('strMealThumb', ''),
        '_id':           raw.get('idMeal', ''),
    }


def download_image(url: str, filename: str) -> bool:
    dest = IMAGES_DIR / filename
    if dest.exists() and dest.stat().st_size > 1000:
        return True
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'FelliFood/1.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            dest.write_bytes(resp.read())
        return True
    except Exception as e:
        print(f'  WARN: {filename}: {e}')
        return False


def recipe_to_js(r: dict, rid: str) -> str:
    lines = [
        '  {',
        f"    id: '{rid}',",
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
    existing = DATA_JS.read_text(encoding='utf-8')
    SPLIT_MARKER = '];\n\n// ─── State Management'
    if SPLIT_MARKER not in existing:
        print('ERROR: Split marker not found in data.js')
        sys.exit(1)
    _, footer = existing.split(SPLIT_MARKER, 1)
    blocks = ',\n\n'.join(recipe_to_js(r, f'r{i+1}') for i, r in enumerate(recipes))
    new_content = (
        '// ─── Initial Recipe Data ─────────────────────────────────────────────────────\n'
        'const INITIAL_RECIPES = [\n\n'
        + blocks
        + '\n\n'
        + SPLIT_MARKER
        + footer
    )
    DATA_JS.write_text(new_content, encoding='utf-8')


def main():
    print('═' * 60)
    print('FelliFood Offline Importer (no API key required)')
    print('═' * 60)

    # Load all raw meals
    raw_dir = CACHE / 'meals_raw'
    raw_files = sorted(raw_dir.glob('*.json'))
    print(f'[1/4] Loading {len(raw_files)} cached raw meals...')
    raw_meals = []
    for p in raw_files:
        try:
            raw_meals.append(json.loads(p.read_text()))
        except Exception:
            pass
    print(f'  Loaded: {len(raw_meals)} meals')

    # Mix in already-translated ones where available
    trans_dir = CACHE / 'translated'
    trans_cache = {}
    for p in trans_dir.glob('*.json'):
        try:
            t = json.loads(p.read_text())
            trans_cache[p.stem] = t
        except Exception:
            pass
    print(f'  {len(trans_cache)} already have Claude translations (will prefer those)')

    # Translate / assemble
    print(f'[2/4] Translating/assembling recipes...')
    recipes = []
    for raw in raw_meals:
        mid = raw.get('idMeal', '')
        if mid in trans_cache:
            t = trans_cache[mid]
            r = {
                'name':          t.get('name', raw.get('strMeal', '')),
                'description':   t.get('beschreibung', ''),
                'label':         t.get('label', 'fleisch'),
                'mahlzeit':      t.get('mahlzeit', ['abendessen']),
                'kueche':        t.get('kueche', 'international'),
                'zeit':          int(t.get('zeit', 30)),
                'schwierigkeit': t.get('schwierigkeit', 'mittel'),
                'zutaten':       t.get('zutaten', []),
                'zubereitung':   t.get('zubereitung', []),
                '_thumb':        raw.get('strMealThumb', ''),
                '_id':           mid,
            }
        else:
            r = translate_raw_meal(raw)

        recipes.append(r)

    # Limit to target
    recipes = recipes[:TOTAL_TARGET]
    print(f'  {len(recipes)} recipes ready')

    # Download images
    print(f'[3/4] Downloading images...')
    done_file = CACHE / 'images_done.txt'
    done = set(done_file.read_text().splitlines()) if done_file.exists() else set()
    downloaded = 0
    failed = 0

    for i, r in enumerate(recipes):
        thumb = r.get('_thumb', '')
        mid   = r.get('_id', str(i))
        if not thumb:
            r['image'] = 'images/recipes/placeholder.jpg'
            continue

        # Generate filename from German name
        fn = kebab(r['name']) + '.jpg'
        r['image'] = f'images/recipes/{fn}'

        if mid not in done:
            ok = download_image(thumb, fn)
            if ok:
                downloaded += 1
                with open(done_file, 'a') as f:
                    f.write(mid + '\n')
            else:
                failed += 1
                r['image'] = 'images/recipes/placeholder.jpg'

            if (i + 1) % 25 == 0:
                print(f'  {i+1}/{len(recipes)} ({downloaded} downloaded, {failed} failed)...')
            time.sleep(0.15)
        else:
            # Already downloaded — make sure image path is set
            dest = IMAGES_DIR / fn
            if not (dest.exists() and dest.stat().st_size > 1000):
                ok = download_image(thumb, fn)
                if not ok:
                    r['image'] = 'images/recipes/placeholder.jpg'

    print(f'  Done: {downloaded} new downloads, {failed} failed')

    # Write data.js
    print(f'[4/4] Writing js/data.js ({len(recipes)} recipes)...')
    write_data_js(recipes)
    print(f'  Done.')

    print('═' * 60)
    print(f'SUCCESS: {len(recipes)} Rezepte importiert.')
    print('Nächste Schritte:')
    print('  Browser: localStorage.removeItem("fellifood_state") → Seite neu laden')
    print('  git add js/data.js images/recipes/ && git commit -m "v0.3.0 — 500 Rezepte"')
    print('═' * 60)


if __name__ == '__main__':
    main()
