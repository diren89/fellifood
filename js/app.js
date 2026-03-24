/* ═══════════════════════════════════════════════════════════════════════════
   FelliFood – App JavaScript
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Auth ────────────────────────────────────────────────────────────────────
const PW_HASH = '3a68dadd356b301edee1659a23e6d387ca953fe5083d396c00218b67824d6a62';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function handleLogin(e) {
  e.preventDefault();
  const pw = document.getElementById('login-password').value;
  const remember = document.getElementById('login-remember').checked;
  const hash = await sha256(pw);
  if (hash === PW_HASH) {
    (remember ? localStorage : sessionStorage).setItem('ff_auth', '1');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
  } else {
    document.getElementById('login-error').textContent = 'Falsches Passwort';
    document.getElementById('login-password').value = '';
  }
}

function checkAuth() {
  const auth = localStorage.getItem('ff_auth') === '1' || sessionStorage.getItem('ff_auth') === '1';
  if (auth) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
  } else {
    document.getElementById('app').classList.add('hidden');
  }
}

// ─── API ─────────────────────────────────────────────────────────────────────
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? ''
  : 'https://fellifood.onrender.com';

// ─── State ──────────────────────────────────────────────────────────────────
let state = initState();
let currentView = 'plan';
let currentRecipeId = null;  // for detail view
let prevView = 'recipes';    // where to go back from detail
let activeFilters = {
  label: [],
  mahlzeit: [],
  kueche: [],
  schwierigkeit: [],
  zeit: []
};
let recipeSearchQuery = '';

// For swap modal
let swapTarget = null; // { dayIdx, mealType }
let modalLabelFilter = 'all';
let modalSearchQuery = '';

// ─── Router ──────────────────────────────────────────────────────────────────
function showView(name, recipeId = null, from = null) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  if (name === 'detail') {
    currentRecipeId = recipeId;
    prevView = from || currentView;
    document.getElementById('view-detail').classList.add('active');
    renderDetail(recipeId);
  } else {
    currentView = name;
    const view = document.getElementById('view-' + name);
    if (view) view.classList.add('active');
    const navItem = document.querySelector(`.nav-item[data-view="${name}"]`);
    if (navItem) navItem.classList.add('active');

    if (name === 'plan')    renderPlan();
    if (name === 'recipes') renderRecipes();
  }
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getRecipe(id) {
  return state.recipes.find(r => r.id === id);
}

function randomRecipeForMeal(mealType, exclude = []) {
  const pool = state.recipes.filter(r =>
    r.mahlzeit.includes(mealType) && !exclude.includes(r.id)
  );
  if (!pool.length) {
    // If no match, pick any
    const any = state.recipes.filter(r => !exclude.includes(r.id));
    if (!any.length) return state.recipes[Math.floor(Math.random() * state.recipes.length)];
    return any[Math.floor(Math.random() * any.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric' });
}

function isToday(iso) {
  return iso === new Date().toISOString().split('T')[0];
}

function mealTypeLabel(type) {
  return { fruehstueck: 'Morgen', mittagessen: 'Mittag', abendessen: 'Abend' }[type] || type;
}
function labelText(label) {
  return { vegan: 'Vegan', vegetarisch: 'Vegetarisch', fleisch: 'Fleisch' }[label] || label;
}
function labelIcon(label) {
  return { vegan: '🌱', vegetarisch: '🥕', fleisch: '🥩' }[label] || '🍽';
}
function zeitText(min) {
  if (min < 60) return min + ' Min.';
  return Math.floor(min/60) + ' Std. ' + (min%60 ? (min%60 + ' Min.') : '');
}
function schwierigkeitText(s) {
  return { einfach: 'Einfach', mittel: 'Mittel', schwer: 'Schwer' }[s] || s;
}
function ratingLabel(r) {
  return ['–', 'Enttäuschend', 'Geht so', 'Gut', 'Sehr gut', 'Ausgezeichnet'][r] || '–';
}

function starHTML(rating, interactive = false, prefix = '') {
  let html = '<div class="star-rating">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= rating ? 'filled' : ''}"
      ${interactive ? `data-star="${i}" data-prefix="${prefix}"` : ''}
      >★</span>`;
  }
  html += '</div>';
  return html;
}

// ─── Save & persist ──────────────────────────────────────────────────────────
function persist() {
  saveState(state);
  const body = JSON.stringify(state);
  _lastPersistedJSON = body;
  fetch(API_BASE + '/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  }).catch(() => {}); // fail silently if server unavailable
}

async function loadFromServer() {
  try {
    const res = await fetch(API_BASE + '/api/state');
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

// ─── Live sync via SSE ───────────────────────────────────────────────────────
let _lastPersistedJSON = null;

function applyRemoteState(incoming) {
  const json = JSON.stringify(incoming);
  if (json === _lastPersistedJSON) return; // our own change, ignore
  state.weekPlan    = incoming.weekPlan;
  state.cyclePlans  = incoming.cyclePlans;
  state.intervalWeeks = incoming.intervalWeeks;
  state.currentWeekOffset = incoming.currentWeekOffset;
  if (currentView === 'plan') renderPlan();
  showToast('Plan aktualisiert');
}

function connectSSE() {
  const es = new EventSource(API_BASE + '/api/events');
  es.onmessage = e => {
    try { applyRemoteState(JSON.parse(e.data)); } catch {}
  };
  es.onerror = () => {
    es.close();
    setTimeout(connectSSE, 5000); // reconnect after 5 s
  };
}

// ─── Cycle / Interval Logic ───────────────────────────────────────────────────
function getCyclePos(offset) {
  const n = state.intervalWeeks;
  return ((offset % n) + n) % n;
}

function intervalLabel(n) {
  return { 1: 'Wöchentlich', 2: '2-wöchig', 4: 'Monatlich' }[n] || n + ' Wochen';
}

// Persist current weekPlan meals into cyclePlans at the current position
function saveToCycle() {
  const pos = getCyclePos(state.currentWeekOffset);
  state.cyclePlans[pos] = state.weekPlan.map(day => ({
    meals: day.meals.map(m => ({ type: m.type, recipeId: m.recipeId, done: m.done }))
  }));
}

// Build weekPlan for given offset, applying cycle template if available
function buildWeekFromCycle(offset) {
  const days = buildEmptyWeekPlan(offset);
  const pos = getCyclePos(offset);
  const template = state.cyclePlans[pos];
  if (template) {
    days.forEach((day, i) => {
      if (template[i]) {
        day.meals = template[i].meals.map(m => ({ ...m }));
      }
    });
  }
  return days;
}

// Generate one week's worth of random meals (no dates, just meal assignments)
function generateCycleWeek() {
  return Array.from({ length: 7 }, () => {
    const used = [];
    return {
      meals: ['fruehstueck', 'mittagessen', 'abendessen'].map(type => {
        const r = randomRecipeForMeal(type, used);
        used.push(r.id);
        return { type, recipeId: r.id, done: false };
      })
    };
  });
}

function navigateToWeek(offset) {
  // Save current week into cycle before switching
  saveToCycle();
  state.currentWeekOffset = offset;
  state.weekPlan = buildWeekFromCycle(offset);
  persist();
  renderPlan();
}

function setIntervalWeeks(n) {
  saveToCycle(); // snapshot current week → current cycle position
  state.intervalWeeks = n;
  // Repeat the current plan across ALL positions in the new cycle
  const currentPos = getCyclePos(state.currentWeekOffset);
  const template = state.cyclePlans[currentPos];
  if (template) {
    for (let pos = 0; pos < n; pos++) {
      state.cyclePlans[pos] = template.map(day => ({
        meals: day.meals.map(m => ({ type: m.type, recipeId: m.recipeId, done: false }))
      }));
    }
  }
  // Trim positions beyond new interval
  Object.keys(state.cyclePlans).forEach(k => {
    if (Number(k) >= n) delete state.cyclePlans[k];
  });
  state.weekPlan = buildWeekFromCycle(state.currentWeekOffset);
  persist();
  renderInterval();
  renderPlan();
  showToast(`Wiederholung: ${intervalLabel(n)} ✓`);
}

function renderInterval() {
  document.querySelectorAll('.interval-chip').forEach(chip => {
    chip.classList.toggle('active', Number(chip.dataset.weeks) === state.intervalWeeks);
  });
}

// ─── Week Plan Logic ─────────────────────────────────────────────────────────
function autoFillPlan() {
  // Fill empty slots in current cycle position only
  state.weekPlan.forEach(day => {
    day.meals.forEach(meal => {
      if (!meal.recipeId) {
        const usedOnDay = day.meals.map(m => m.recipeId).filter(Boolean);
        meal.recipeId = randomRecipeForMeal(meal.type, usedOnDay).id;
      }
    });
  });
  saveToCycle();
  persist();
  renderPlan();
  showToast('Leere Mahlzeiten befüllt ✓');
}

function autoFillAll() {
  // Regenerate all cycle positions
  for (let pos = 0; pos < state.intervalWeeks; pos++) {
    state.cyclePlans[pos] = generateCycleWeek();
  }
  state.weekPlan = buildWeekFromCycle(state.currentWeekOffset);
  persist();
  renderPlan();
  const label = state.intervalWeeks > 1 ? ` (${intervalLabel(state.intervalWeeks)})` : '';
  showToast(`Neu gewürfelt${label} ✓`);
}

function toggleMealDone(dayIdx, mealType) {
  const meal = state.weekPlan[dayIdx].meals.find(m => m.type === mealType);
  if (!meal) return;
  meal.done = !meal.done;
  saveToCycle();
  persist();
  renderPlan();
}

function removeMealRecipe(dayIdx, mealType) {
  const meal = state.weekPlan[dayIdx].meals.find(m => m.type === mealType);
  if (!meal) return;
  meal.recipeId = null;
  meal.done = false;
  saveToCycle();
  persist();
  renderPlan();
}

function swapMealRecipe(dayIdx, mealType) {
  swapTarget = { dayIdx, mealType };
  const meal = state.weekPlan[dayIdx].meals.find(m => m.type === mealType);
  document.getElementById('modal-meal-label').textContent =
    meal ? mealTypeLabel(meal.type) : 'Mahlzeit';
  modalLabelFilter = 'all';
  modalSearchQuery = '';
  renderModalRecipes();
  openModal();
}

function assignRecipeToSwapTarget(recipeId) {
  if (!swapTarget) return;
  const { dayIdx, mealType } = swapTarget;
  const meal = state.weekPlan[dayIdx].meals.find(m => m.type === mealType);
  if (!meal) return;
  meal.recipeId = recipeId;
  meal.done = false;
  saveToCycle();
  persist();
  closeModal();
  renderPlan();
  const r = getRecipe(recipeId);
  showToast(r ? `"${r.name}" zugewiesen` : 'Rezept zugewiesen');
}

// ─── Render: Plan ─────────────────────────────────────────────────────────────
function renderPlan() {
  const container = document.getElementById('plan-days');
  const today = new Date().toISOString().split('T')[0];

  // Update week label
  const first = state.weekPlan[0];
  const last  = state.weekPlan[6];
  document.getElementById('week-label').textContent =
    `${formatDate(first.date)} – ${formatDate(last.date)}`;

  container.innerHTML = state.weekPlan.map((day, dayIdx) => {
    const todayClass = isToday(day.date) ? 'today' : '';
    const doneMeals = day.meals.filter(m => m.done).length;
    const totalFilled = day.meals.filter(m => m.recipeId).length;

    const mealsHTML = day.meals.map(meal => {
      const recipe = meal.recipeId ? getRecipe(meal.recipeId) : null;
      const doneClass = meal.done ? 'done' : '';
      const checkedClass = meal.done ? 'checked' : '';
      const nameClass = recipe ? '' : 'empty';
      const nameText = recipe ? recipe.name : 'Kein Rezept';
      const dotHTML = recipe
        ? `<span class="meal-label-dot ${recipe.label}"></span>` : '';

      return `
        <div class="meal-row ${doneClass}" data-day="${dayIdx}" data-meal="${meal.type}">
          <button class="meal-check ${checkedClass}"
            onclick="toggleMealDone(${dayIdx}, '${meal.type}')"
            aria-label="Abgehakt">
            ${meal.done ? '✓' : ''}
          </button>
          <span class="meal-type-label ${meal.type}">${mealTypeLabel(meal.type)}</span>
          <div class="meal-info" onclick="${recipe ? `showView('detail','${recipe.id}','plan')` : `swapMealRecipe(${dayIdx},'${meal.type}')`}">
            <div class="meal-recipe-name ${nameClass}">${dotHTML}${nameText}</div>
            ${recipe ? `<div class="meal-recipe-sub">${zeitText(recipe.zeit)} · ${schwierigkeitText(recipe.schwierigkeit)}</div>` : ''}
          </div>
          <div class="meal-actions">
            <button class="meal-action-btn" title="Rezept wechseln"
              onclick="swapMealRecipe(${dayIdx},'${meal.type}')">↺</button>
            ${meal.recipeId ? `<button class="meal-action-btn" title="Entfernen"
              onclick="removeMealRecipe(${dayIdx},'${meal.type}')">✕</button>` : ''}
          </div>
        </div>`;
    }).join('');

    const isCollapsed = !isToday(day.date) && day.date < today;
    const todayCardClass = isToday(day.date) ? 'today-card' : '';
    return `
      <div class="day-card ${isCollapsed ? 'collapsed' : ''} ${todayCardClass}" id="day-card-${dayIdx}">
        <div class="day-header" onclick="toggleDayCard(${dayIdx})">
          <div class="day-header-left">
            <div class="day-stripe"></div>
            <div class="day-name-wrap">
              <div class="day-name">
                ${day.label}
                ${isToday(day.date) ? '<span class="day-today-badge">Heute</span>' : ''}
              </div>
              <div class="day-date">${formatDate(day.date)}</div>
            </div>
          </div>
          <div class="day-header-right">
            ${totalFilled > 0 ? `<span class="day-progress">${doneMeals}/${totalFilled}</span>` : ''}
            <span class="day-toggle">▾</span>
          </div>
        </div>
        <div class="day-meals">${mealsHTML}</div>
      </div>`;
  }).join('');
}

function toggleDayCard(dayIdx) {
  document.getElementById(`day-card-${dayIdx}`).classList.toggle('collapsed');
}

// ─── Render: Recipes ──────────────────────────────────────────────────────────
function getFilteredRecipes() {
  return state.recipes.filter(r => {
    if (activeFilters.label.length && !activeFilters.label.includes(r.label)) return false;
    if (activeFilters.mahlzeit.length && !r.mahlzeit.some(m => activeFilters.mahlzeit.includes(m))) return false;
    if (activeFilters.kueche.length && !activeFilters.kueche.includes(r.kueche)) return false;
    if (activeFilters.schwierigkeit.length && !activeFilters.schwierigkeit.includes(r.schwierigkeit)) return false;
    if (activeFilters.zeit.length) {
      const match = activeFilters.zeit.some(z => {
        if (z === 'u30') return r.zeit < 30;
        if (z === '30-60') return r.zeit >= 30 && r.zeit <= 60;
        if (z === 'u60') return r.zeit > 60;
        return false;
      });
      if (!match) return false;
    }
    if (recipeSearchQuery) {
      const q = recipeSearchQuery.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function renderRecipes() {
  const recipes = getFilteredRecipes();
  const list = document.getElementById('recipe-list');

  // Update results count
  document.getElementById('recipe-results-count').textContent =
    `${recipes.length} Rezept${recipes.length !== 1 ? 'e' : ''}`;

  // Active filter tags
  renderActiveFilterTags();

  if (!recipes.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Keine Rezepte gefunden.<br>Passe deine Filter an.</p>
      </div>`;
    return;
  }

  list.innerHTML = recipes.map(r => `
    <div class="recipe-card" onclick="showView('detail','${r.id}','recipes')">
      <div class="recipe-card-img-wrap">
        <img class="recipe-card-img" src="${r.image}" alt="${r.name}" loading="lazy"
          onerror="this.parentElement.style.display='none'">
        <div class="recipe-card-img-overlay"></div>
        <div class="recipe-card-img-badges">
          <span class="recipe-badge ${r.label}">${labelIcon(r.label)} ${labelText(r.label)}</span>
        </div>
      </div>
      <div class="recipe-card-body">
        <div class="recipe-card-name">${r.name}</div>
        <div class="recipe-card-meta">
          <span class="recipe-badge zeit">⏱ ${zeitText(r.zeit)}</span>
          <span class="recipe-badge schwierigkeit">📊 ${schwierigkeitText(r.schwierigkeit)}</span>
        </div>
        <div class="recipe-card-desc">${r.description}</div>
        ${r.bewertung > 0 ? `
        <div class="recipe-card-footer">
          <div class="card-rating">${[1,2,3,4,5].map(i =>
            `<span class="star ${i <= r.bewertung ? 'filled' : ''}">★</span>`).join('')}
          </div>
          <span style="font-size:.72rem;color:var(--text-muted);font-weight:600">${ratingLabel(r.bewertung)}</span>
        </div>` : ''}
      </div>
    </div>`).join('');
}

function renderActiveFilterTags() {
  const bar = document.getElementById('active-filters-bar');
  const tags = [];

  const labelMap = { vegan: 'Vegan', vegetarisch: 'Vegetarisch', fleisch: 'Fleisch' };
  const mahlzeitMap = { fruehstueck: 'Frühstück', mittagessen: 'Mittagessen', abendessen: 'Abendessen', snack: 'Snack' };
  const kueMap = { deutsch: 'Deutsch', italienisch: 'Italienisch', asiatisch: 'Asiatisch', mexikanisch: 'Mexikanisch', international: 'International' };
  const zeitMap = { u30: 'Unter 30 Min.', '30-60': '30–60 Min.', u60: 'Über 60 Min.' };
  const schwMap = { einfach: 'Einfach', mittel: 'Mittel', schwer: 'Schwer' };

  activeFilters.label.forEach(v => tags.push({ group: 'label', val: v, text: labelMap[v] || v }));
  activeFilters.mahlzeit.forEach(v => tags.push({ group: 'mahlzeit', val: v, text: mahlzeitMap[v] || v }));
  activeFilters.kueche.forEach(v => tags.push({ group: 'kueche', val: v, text: kueMap[v] || v }));
  activeFilters.zeit.forEach(v => tags.push({ group: 'zeit', val: v, text: zeitMap[v] || v }));
  activeFilters.schwierigkeit.forEach(v => tags.push({ group: 'schwierigkeit', val: v, text: schwMap[v] || v }));

  if (!tags.length) { bar.innerHTML = ''; return; }

  bar.innerHTML = tags.map(t => `
    <span class="active-filter-tag" onclick="removeFilter('${t.group}','${t.val}')">
      ${t.text} <span class="remove">×</span>
    </span>`).join('');
}

function toggleFilter(group, val) {
  const arr = activeFilters[group];
  const idx = arr.indexOf(val);
  if (idx === -1) arr.push(val);
  else arr.splice(idx, 1);
  syncFilterChips();
  renderRecipes();
}

function removeFilter(group, val) {
  const arr = activeFilters[group];
  const idx = arr.indexOf(val);
  if (idx !== -1) arr.splice(idx, 1);
  syncFilterChips();
  renderRecipes();
}

function clearAllFilters() {
  activeFilters = { label: [], mahlzeit: [], kueche: [], schwierigkeit: [], zeit: [] };
  recipeSearchQuery = '';
  document.getElementById('recipe-search').value = '';
  syncFilterChips();
  renderRecipes();
}

function syncFilterChips() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    const group = chip.dataset.group;
    const val = chip.dataset.val;
    const isActive = activeFilters[group] && activeFilters[group].includes(val);
    chip.classList.toggle('active', isActive);
  });
  // Quick pills
  document.querySelectorAll('.filter-pill[data-group]').forEach(pill => {
    const group = pill.dataset.group;
    const val = pill.dataset.val;
    const isActive = activeFilters[group] && activeFilters[group].includes(val);
    pill.classList.toggle('active', isActive);
    pill.classList.toggle(val, isActive); // for color
  });
}

// ─── Render: Detail ───────────────────────────────────────────────────────────
function renderDetail(id) {
  const r = getRecipe(id);
  if (!r) { showView('recipes'); return; }

  const container = document.getElementById('view-detail');
  container.innerHTML = `
    <div class="main-content">
      <div class="detail-back" onclick="showView('${prevView}')">← Zurück</div>

      <div class="detail-hero">
        <img class="detail-img" src="${r.image}" alt="${r.name}"
          onerror="this.style.display='none'">
        <div class="detail-hero-overlay"></div>
        <div class="detail-hero-badges">
          <span class="recipe-badge ${r.label}">${labelIcon(r.label)} ${labelText(r.label)}</span>
        </div>
      </div>

      <h1 class="detail-title">${r.name}</h1>
      <div class="detail-meta">
        <span class="recipe-badge zeit">⏱ ${zeitText(r.zeit)}</span>
        <span class="recipe-badge schwierigkeit">📊 ${schwierigkeitText(r.schwierigkeit)}</span>
      </div>
      <p class="detail-desc">${r.description}</p>

      <div class="rating-block">
        <h3>Bewertung</h3>
        <div class="rating-stars" id="detail-stars">
          ${[1,2,3,4,5].map(i => `
            <span class="star ${i <= r.bewertung ? 'filled' : ''}"
              onclick="setRating('${r.id}', ${i})">★</span>
          `).join('')}
        </div>
        <div class="rating-label" id="rating-label-text">${ratingLabel(r.bewertung)}</div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Zutaten</div>
        <ul class="ingredient-list">
          ${r.zutaten.map(z => `<li>${z}</li>`).join('')}
        </ul>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">Zubereitung</div>
        <ol class="step-list">
          ${r.zubereitung.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>

      <div class="notes-block">
        <h3>Meine Notizen</h3>
        <textarea class="notes-textarea" id="recipe-notes"
          placeholder="Persönliche Notizen, Änderungen, Tipps…">${r.notizen || ''}</textarea>
        <div class="notes-save-row">
          <button class="btn btn-primary btn-sm" onclick="saveNotes('${r.id}')">Speichern</button>
        </div>
      </div>
    </div>`;
}

function setRating(recipeId, stars) {
  const r = getRecipe(recipeId);
  if (!r) return;
  r.bewertung = stars;
  persist();
  // Update stars in DOM
  document.querySelectorAll('#detail-stars .star').forEach((s, i) => {
    s.classList.toggle('filled', i < stars);
  });
  document.getElementById('rating-label-text').textContent = ratingLabel(stars);
  showToast(`Bewertet: ${stars} Stern${stars !== 1 ? 'e' : ''} ★`);
}

function saveNotes(recipeId) {
  const r = getRecipe(recipeId);
  if (!r) return;
  r.notizen = document.getElementById('recipe-notes').value;
  persist();
  showToast('Notizen gespeichert ✓');
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  swapTarget = null;
}

function renderModalRecipes() {
  const q = modalSearchQuery.toLowerCase();
  const recipes = state.recipes.filter(r => {
    if (modalLabelFilter !== 'all' && r.label !== modalLabelFilter) return false;
    if (q && !r.name.toLowerCase().includes(q)) return false;
    return true;
  });

  document.querySelectorAll('.modal-label-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.val === modalLabelFilter);
    if (p.dataset.val !== 'all') p.classList.toggle(p.dataset.val, p.dataset.val === modalLabelFilter);
  });

  const list = document.getElementById('modal-recipe-list');
  if (!recipes.length) {
    list.innerHTML = '<div class="empty-state"><p>Keine Rezepte gefunden.</p></div>';
    return;
  }
  list.innerHTML = recipes.map(r => `
    <div class="modal-recipe-item" onclick="assignRecipeToSwapTarget('${r.id}')">
      <img class="modal-recipe-thumb" src="${r.image}" alt="${r.name}"
        onerror="this.style.display='none'">
      <div class="modal-recipe-info">
        <div class="modal-recipe-name">${r.name}</div>
        <div class="modal-recipe-meta">⏱ ${zeitText(r.zeit)} · ${schwierigkeitText(r.schwierigkeit)}</div>
      </div>
      <span class="recipe-badge ${r.label}">${labelIcon(r.label)}</span>
    </div>`).join('');
}

// ─── Add Recipe Form ──────────────────────────────────────────────────────────
function openAddRecipeModal() {
  document.getElementById('rf-name').value = '';
  document.getElementById('rf-desc').value = '';
  document.getElementById('rf-label').value = 'fleisch';
  document.getElementById('rf-kueche').value = 'international';
  document.getElementById('rf-zeit').value = '30';
  document.getElementById('rf-schwierigkeit').value = 'einfach';
  document.getElementById('rf-zutaten').value = '';
  document.getElementById('rf-zubereitung').value = '';
  document.querySelectorAll('#rf-mahlzeit-chips .form-checkbox-chip').forEach(chip => {
    const cb = chip.querySelector('input');
    cb.checked = chip.dataset.val === 'abendessen';
    chip.classList.toggle('selected', chip.dataset.val === 'abendessen');
  });
  document.getElementById('recipe-form-overlay').classList.add('open');
}

function closeAddRecipeModal() {
  document.getElementById('recipe-form-overlay').classList.remove('open');
}

function saveNewRecipe() {
  const name = document.getElementById('rf-name').value.trim();
  const desc = document.getElementById('rf-desc').value.trim();
  const zutatenRaw = document.getElementById('rf-zutaten').value.trim();
  const zubereitungRaw = document.getElementById('rf-zubereitung').value.trim();
  if (!name || !desc || !zutatenRaw || !zubereitungRaw) {
    showToast('Bitte alle Pflichtfelder ausfüllen.'); return;
  }
  const mahlzeit = [];
  document.querySelectorAll('#rf-mahlzeit-chips input:checked').forEach(cb => mahlzeit.push(cb.value));
  if (!mahlzeit.length) { showToast('Bitte mindestens eine Mahlzeit wählen.'); return; }
  const recipe = {
    id: 'r' + Date.now(),
    name, description: desc,
    label: document.getElementById('rf-label').value,
    mahlzeit,
    kueche: document.getElementById('rf-kueche').value,
    zeit: parseInt(document.getElementById('rf-zeit').value) || 30,
    schwierigkeit: document.getElementById('rf-schwierigkeit').value,
    zutaten: zutatenRaw.split('\n').map(l => l.trim()).filter(Boolean),
    zubereitung: zubereitungRaw.split('\n').map(l => l.trim()).filter(Boolean),
    image: 'images/recipes/grain-salad.jpg',
    bewertung: 0, notizen: ''
  };
  state.recipes.push(recipe);
  persist();
  closeAddRecipeModal();
  renderRecipes();
  showToast(`"${name}" hinzugefügt ✓`);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  checkAuth();

  // Load shared state from server first, fall back to localStorage
  const serverState = await loadFromServer();
  if (serverState) {
    const savedIds = new Set(serverState.recipes.map(r => r.id));
    const newRecipes = INITIAL_RECIPES.filter(r => !savedIds.has(r.id));
    if (newRecipes.length) serverState.recipes = [...serverState.recipes, ...newRecipes];
    const imageMap = Object.fromEntries(INITIAL_RECIPES.map(r => [r.id, r.image]));
    serverState.recipes = serverState.recipes.map(r =>
      imageMap[r.id] ? { ...r, image: imageMap[r.id] } : r
    );
    if (!serverState.intervalWeeks) serverState.intervalWeeks = 1;
    if (!serverState.cyclePlans)    serverState.cyclePlans = {};
    state = serverState;
    saveState(state);
  }

  // Live sync via SSE
  connectSSE();

  // Nav clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => showView(item.dataset.view));
  });

  // Week prev/next
  document.getElementById('btn-week-prev').addEventListener('click', () => {
    navigateToWeek(state.currentWeekOffset - 1);
  });
  document.getElementById('btn-week-next').addEventListener('click', () => {
    navigateToWeek(state.currentWeekOffset + 1);
  });

  // Interval chips
  document.querySelectorAll('.interval-chip').forEach(chip => {
    chip.addEventListener('click', () => setIntervalWeeks(Number(chip.dataset.weeks)));
  });
  renderInterval();

  // Auto-fill buttons
  document.getElementById('btn-autofill').addEventListener('click', autoFillPlan);
  document.getElementById('btn-autofill-all').addEventListener('click', autoFillAll);

  // Recipe search
  const searchEl = document.getElementById('recipe-search');
  searchEl.addEventListener('input', e => {
    recipeSearchQuery = e.target.value.trim();
    renderRecipes();
  });

  // Filter pills (quick)
  document.querySelectorAll('.filter-pill[data-group]').forEach(pill => {
    pill.addEventListener('click', () => {
      toggleFilter(pill.dataset.group, pill.dataset.val);
    });
  });

  // Filter section toggles
  document.querySelectorAll('.filter-section-header').forEach(h => {
    h.addEventListener('click', () => {
      h.closest('.filter-section').classList.toggle('open');
    });
  });

  // Filter chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      toggleFilter(chip.dataset.group, chip.dataset.val);
    });
  });

  // Clear filters
  document.getElementById('btn-clear-filters').addEventListener('click', clearAllFilters);

  // Add recipe button
  document.getElementById('btn-add-recipe').addEventListener('click', openAddRecipeModal);
  document.getElementById('recipe-form-close').addEventListener('click', closeAddRecipeModal);
  document.getElementById('recipe-form-cancel').addEventListener('click', closeAddRecipeModal);
  document.getElementById('recipe-form-save').addEventListener('click', saveNewRecipe);
  document.getElementById('recipe-form-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('recipe-form-overlay')) closeAddRecipeModal();
  });

  // Mahlzeit chips toggle
  document.querySelectorAll('#rf-mahlzeit-chips .form-checkbox-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cb = chip.querySelector('input');
      cb.checked = !cb.checked;
      chip.classList.toggle('selected', cb.checked);
    });
  });

  // Modal close
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  // Modal search
  document.getElementById('modal-search-input').addEventListener('input', e => {
    modalSearchQuery = e.target.value.trim();
    renderModalRecipes();
  });

  // Modal label pills
  document.querySelectorAll('.modal-label-pill').forEach(p => {
    p.addEventListener('click', () => {
      modalLabelFilter = p.dataset.val;
      renderModalRecipes();
    });
  });

  // Initial render
  showView('plan');
});
