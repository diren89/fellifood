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

// ─── Infinite Scroll ──────────────────────────────────────────────────────────
const RECIPES_PAGE_SIZE = 24;
let _recipePage        = 0;   // how many pages already rendered
let _filteredRecipes   = [];  // current filtered+sorted list
let _scrollObserver    = null;

// For swap modal
let swapTarget = null; // { dayIdx, mealType }
let modalLabelFilter = 'all';
let newRecipeImageData = null;
let _constraintPickerKey = null;

// For drag & drop
let dragSrc = null;
let touchDragSrc = null;
let touchDragTimer = null;
let touchDragGhost = null;
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

    if (name === 'plan')     renderPlan();
    if (name === 'recipes')  renderRecipes();
    if (name === 'settings') renderSettings();
    if (name === 'shopping') renderShoppingList();
    const fab = document.getElementById('fab-plan');
    if (fab) { fab.style.display = name === 'plan' ? 'flex' : 'none'; fab.classList.remove('open'); }
    const hm = document.getElementById('header-menu');
    if (hm) hm.classList.remove('open');

    // Back-to-Top: ausblenden wenn View gewechselt wird
    const btt = document.getElementById('btn-back-to-top');
    if (btt) btt.classList.remove('visible');

    // Aktive View für Reload speichern
    localStorage.setItem('ff_last_view', name);
    location.hash = name;
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
  state.lastModified = Date.now();
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
  const dayNames = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
  return dayNames.map(dayLabel => {
    const used = [];
    return {
      meals: ['fruehstueck', 'mittagessen', 'abendessen'].map(type => {
        const key = dayLabel + '.' + type;
        const pinned = state.settings?.dayConstraints?.[key];
        if (pinned) {
          used.push(pinned);
          return { type, recipeId: pinned, done: false };
        }
        const r = randomRecipeForMeal(type, used);
        if (r) used.push(r.id);
        return { type, recipeId: r ? r.id : null, done: false };
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

// ─── Settings ────────────────────────────────────────────────────────────────
function renderSettings() {
  const days = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
  const meals = [
    { type: 'fruehstueck', label: 'Morgen' },
    { type: 'mittagessen', label: 'Mittag' },
    { type: 'abendessen',  label: 'Abend'  }
  ];
  const container = document.querySelector('#view-settings .main-content');
  container.innerHTML = `
    <div class="section-eyebrow">Konfiguration</div>
    <div class="section-title" style="margin-bottom:18px">Einstellungen</div>

    <div class="settings-block">
      <div class="settings-block-title">Wiederholung</div>
      <div class="interval-chips">
        ${[1,2,4].map(n => `<button class="interval-chip ${state.intervalWeeks===n?'active':''}" data-weeks="${n}">${intervalLabel(n)}</button>`).join('')}
      </div>
    </div>

    <div class="settings-block">
      <div class="settings-block-title">Feste Vorgaben</div>
      <div class="settings-block-desc">Lege für bestimmte Tag-/Mahlzeit-Kombinationen ein festes Rezept fest. Es wird beim automatischen Befüllen immer eingesetzt.</div>
      <div class="day-constraints-grid">
        ${days.map(day => `
          <div class="dc-day-row">
            <div class="dc-day-label">${day}</div>
            <div class="dc-meals">
              ${meals.map(m => {
                const key = day + '.' + m.type;
                const pinnedId = state.settings.dayConstraints[key];
                const pinned = pinnedId ? getRecipe(pinnedId) : null;
                return `<div class="dc-meal-cell">
                  <div class="dc-meal-label">${m.label}</div>
                  ${pinned
                    ? `<div class="dc-pinned-chip" onclick="removeConstraint('${key}')"><span>${pinned.name}</span><span class="dc-remove">✕</span></div>`
                    : `<button class="dc-add-btn" onclick="openConstraintPicker('${key}')">＋</button>`}
                </div>`;
              }).join('')}
            </div>
          </div>`).join('')}
      </div>
    </div>`;

  container.querySelectorAll('.interval-chip').forEach(chip => {
    chip.addEventListener('click', () => setIntervalWeeks(Number(chip.dataset.weeks)));
  });
}

function openConstraintPicker(key) {
  _constraintPickerKey = key;
  const mealType = key.split('.')[1];
  swapTarget = null;
  document.getElementById('modal-meal-label').textContent = 'Vorgabe wählen';
  modalLabelFilter = 'all';
  modalSearchQuery = '';
  renderModalRecipes();
  openModal();
}

function saveConstraint(key, recipeId) {
  state.settings.dayConstraints[key] = recipeId;
  persist();
  showToast('Vorgabe gespeichert ✓');
}

function removeConstraint(key) {
  delete state.settings.dayConstraints[key];
  persist();
  renderSettings();
  showToast('Vorgabe entfernt');
}

// ─── Week Plan Logic ─────────────────────────────────────────────────────────
function autoFillPlan() {
  // Fill empty slots in current cycle position only
  state.weekPlan.forEach(day => {
    day.meals.forEach(meal => {
      if (!meal.recipeId) {
        const key = day.label + '.' + meal.type;
        const pinned = state.settings?.dayConstraints?.[key];
        if (pinned) {
          meal.recipeId = pinned;
        } else {
          const usedOnDay = day.meals.map(m => m.recipeId).filter(Boolean);
          const r = randomRecipeForMeal(meal.type, usedOnDay);
          if (r) meal.recipeId = r.id;
        }
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
  // Constraint-Picker-Modus
  if (_constraintPickerKey) {
    saveConstraint(_constraintPickerKey, recipeId);
    _constraintPickerKey = null;
    closeModal();
    renderSettings();
    return;
  }
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
        <div class="meal-row ${doneClass}" data-day="${dayIdx}" data-meal="${meal.type}"
          ${recipe ? `draggable="true" ondragstart="onMealDragStart(event,${dayIdx},'${meal.type}')" ondragend="onMealDragEnd(event)"` : ''}
          ondragover="onMealDragOver(event)" ondragleave="onMealDragLeave(event)" ondrop="onMealDrop(event,${dayIdx},'${meal.type}')">
          ${recipe ? '<span class="meal-drag-handle">⠿</span>' : ''}
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

// ─── Drag & Drop ──────────────────────────────────────────────────────────────
function swapMeals(srcDay, srcMeal, dstDay, dstMeal) {
  const src = state.weekPlan[srcDay].meals.find(m => m.type === srcMeal);
  const dst = state.weekPlan[dstDay].meals.find(m => m.type === dstMeal);
  if (!src || !dst) return;
  [src.recipeId, dst.recipeId] = [dst.recipeId, src.recipeId];
  [src.done,     dst.done]     = [dst.done,     src.done];
  persist();
  renderPlan();
}

function onMealDragStart(e, dayIdx, mealType) {
  dragSrc = { dayIdx, mealType };
  e.dataTransfer.effectAllowed = 'move';
  e.currentTarget.classList.add('dragging');
}

function onMealDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.meal-row.drag-over').forEach(el => el.classList.remove('drag-over'));
  dragSrc = null;
}

function onMealDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function onMealDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onMealDrop(e, dayIdx, mealType) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!dragSrc) return;
  if (dragSrc.dayIdx === dayIdx && dragSrc.mealType === mealType) return;
  swapMeals(dragSrc.dayIdx, dragSrc.mealType, dayIdx, mealType);
  dragSrc = null;
}

function initMealDrag() {
  document.addEventListener('touchstart', e => {
    const row = e.target.closest('[draggable].meal-row');
    if (!row || e.target.closest('button')) return;
    const touch = e.touches[0];

    touchDragTimer = setTimeout(() => {
      touchDragSrc = { dayIdx: parseInt(row.dataset.day), mealType: row.dataset.meal };
      row.classList.add('dragging');

      touchDragGhost = row.cloneNode(true);
      touchDragGhost.classList.add('meal-drag-ghost');
      const rect = row.getBoundingClientRect();
      touchDragGhost.style.cssText =
        `position:fixed;width:${rect.width}px;left:${rect.left}px;top:${rect.top}px;pointer-events:none;z-index:9999;`;
      document.body.appendChild(touchDragGhost);
    }, 250);
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    clearTimeout(touchDragTimer);
    if (!touchDragSrc) return;

    const touch = e.touches[0];
    if (touchDragGhost) {
      touchDragGhost.style.left = touch.clientX - touchDragGhost.offsetWidth / 2 + 'px';
      touchDragGhost.style.top  = touch.clientY - touchDragGhost.offsetHeight / 2 + 'px';
    }
    touchDragGhost.style.display = 'none';
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    touchDragGhost.style.display = '';
    document.querySelectorAll('.meal-row.drag-over').forEach(r => r.classList.remove('drag-over'));
    el?.closest('.meal-row')?.classList.add('drag-over');
  }, { passive: true });

  document.addEventListener('touchend', e => {
    clearTimeout(touchDragTimer);
    if (!touchDragSrc) return;

    const touch = e.changedTouches[0];
    if (touchDragGhost) touchDragGhost.style.display = 'none';
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    touchDragGhost?.remove();
    touchDragGhost = null;

    document.querySelectorAll('.meal-row.dragging, .meal-row.drag-over')
      .forEach(r => r.classList.remove('dragging', 'drag-over'));

    const targetRow = el?.closest('.meal-row');
    if (targetRow) {
      const dstDay  = parseInt(targetRow.dataset.day);
      const dstMeal = targetRow.dataset.meal;
      if (!(dstDay === touchDragSrc.dayIdx && dstMeal === touchDragSrc.mealType)) {
        swapMeals(touchDragSrc.dayIdx, touchDragSrc.mealType, dstDay, dstMeal);
      }
    }
    touchDragSrc = null;
  }, { passive: true });
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

function recipeCardHTML(r) {
  return `
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
    </div>`;
}

function _appendNextPage() {
  const list   = document.getElementById('recipe-list');
  const start  = _recipePage * RECIPES_PAGE_SIZE;
  const slice  = _filteredRecipes.slice(start, start + RECIPES_PAGE_SIZE);
  if (!slice.length) return;

  // Remove sentinel before appending, re-add after
  const sentinel = document.getElementById('recipe-sentinel');
  if (sentinel) sentinel.remove();

  const frag = document.createDocumentFragment();
  slice.forEach(r => {
    const div = document.createElement('div');
    div.innerHTML = recipeCardHTML(r).trim();
    frag.appendChild(div.firstElementChild);
  });
  list.appendChild(frag);
  _recipePage++;

  // Re-add sentinel if more pages remain
  if (_recipePage * RECIPES_PAGE_SIZE < _filteredRecipes.length) {
    const s = document.createElement('div');
    s.id = 'recipe-sentinel';
    s.className = 'recipe-sentinel';
    list.appendChild(s);
    if (_scrollObserver) _scrollObserver.observe(s);
  }
}

function _initScrollObserver() {
  if (_scrollObserver) { _scrollObserver.disconnect(); _scrollObserver = null; }
  _scrollObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) _appendNextPage();
  }, { rootMargin: '200px' });
}

function renderRecipes() {
  _filteredRecipes = getFilteredRecipes();
  _recipePage = 0;

  const list = document.getElementById('recipe-list');

  // Update results count
  document.getElementById('recipe-results-count').textContent =
    `${_filteredRecipes.length} Rezept${_filteredRecipes.length !== 1 ? 'e' : ''}`;

  renderActiveFilterTags();

  // Disconnect old observer and clear list
  if (_scrollObserver) { _scrollObserver.disconnect(); _scrollObserver = null; }
  list.innerHTML = '';

  if (!_filteredRecipes.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Keine Rezepte gefunden.<br>Passe deine Filter an.</p>
      </div>`;
    return;
  }

  _initScrollObserver();
  _appendNextPage(); // render first page immediately
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
        <button class="detail-img-change-btn" onclick="changeRecipeImage('${r.id}')" title="Bild ändern">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
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

function changeRecipeImage(recipeId) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        const scale = img.width > MAX ? MAX / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        const r = getRecipe(recipeId);
        if (!r) return;
        r.image = dataUrl;
        persist();
        const el = document.querySelector('.detail-img');
        if (el) el.src = dataUrl;
        showToast('Bild gespeichert ✓');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
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
  newRecipeImageData = null;
  const preview = document.getElementById('rf-img-preview');
  if (preview) preview.src = 'images/recipes/grain-salad.jpg';
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
    image: newRecipeImageData || 'images/recipes/grain-salad.jpg',
    bewertung: 0, notizen: ''
  };
  state.recipes.push(recipe);
  persist();
  closeAddRecipeModal();
  renderRecipes();
  showToast(`"${name}" hinzugefügt ✓`);
}

// ─── Shopping List ────────────────────────────────────────────────────────────
function _parseIngredient(str) {
  str = str.trim();
  const nm = str.match(/^(\d+(?:[.,]\d+)?)\s*/);
  if (!nm) return { amount: null, unit: null, name: str.toLowerCase() };
  const amount = parseFloat(nm[1].replace(',', '.'));
  let rest = str.slice(nm[0].length).trim();
  const um = rest.match(/^(kg|g|ml|cl|dl|l|EL|TL|Pkg|Pck|Bund|Zehen?|Scheiben?|Dosen?|Becher|Gläser|Glas|Stück|St)\b\s*/);
  let unit = null;
  if (um) { unit = um[1]; rest = rest.slice(um[0].length).trim(); }
  return { amount, unit, name: rest.toLowerCase() };
}

function _fmtAmt(n) {
  if (n % 1 === 0) return String(n);
  return String(Math.round(n * 10) / 10).replace('.', ',');
}

function _aggregateIngredients(recipes) {
  const map = new Map();
  const misc = new Set();
  for (const r of recipes) {
    for (const z of r.zutaten) {
      const p = _parseIngredient(z);
      if (p.amount === null) {
        misc.add(p.name);
      } else {
        const key = (p.unit || '') + '::' + p.name;
        if (map.has(key)) map.get(key).amount += p.amount;
        else map.set(key, { amount: p.amount, unit: p.unit, name: p.name });
      }
    }
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const items = [...map.values()]
    .map(i => i.unit ? `${_fmtAmt(i.amount)} ${i.unit} ${cap(i.name)}` : `${_fmtAmt(i.amount)} ${cap(i.name)}`)
    .sort();
  const miscItems = [...misc].map(cap).sort();
  return [...items, ...miscItems];
}

function renderShoppingList() {
  const seen = new Set();
  const recipes = state.weekPlan
    .flatMap(day => day.meals)
    .filter(m => m.recipeId)
    .map(m => getRecipe(m.recipeId))
    .filter(r => r && !seen.has(r.id) && seen.add(r.id));

  const container = document.getElementById('shopping-list-content');

  if (recipes.length === 0) {
    container.innerHTML = '<p class="shopping-empty">Kein Wochenplan vorhanden.<br>Erstelle zuerst einen Plan.</p>';
    return;
  }

  const items = _aggregateIngredients(recipes);
  container.innerHTML = `
    <ul class="shopping-ingredient-list">
      ${items.map(item => `
        <li class="shopping-item">
          <div class="shopping-check"></div>
          <span>${item}</span>
        </li>
      `).join('')}
    </ul>
  `;

  container.querySelectorAll('.shopping-item').forEach(row => {
    row.addEventListener('click', () => {
      const isDone = row.classList.toggle('done');
      row.querySelector('.shopping-check').classList.toggle('checked', isDone);
    });
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  checkAuth();

  // Load state: use whichever of server or localStorage is newer
  const serverState = await loadFromServer();
  const localState  = loadState();
  const serverTime  = serverState?.lastModified || 0;
  const localTime   = localState?.lastModified  || 0;

  function mergeRecipes(s) {
    const savedIds = new Set(s.recipes.map(r => r.id));
    const newRecipes = INITIAL_RECIPES.filter(r => !savedIds.has(r.id));
    if (newRecipes.length) s.recipes = [...s.recipes, ...newRecipes];
    const imageMap = Object.fromEntries(INITIAL_RECIPES.map(r => [r.id, r.image]));
    s.recipes = s.recipes.map(r => imageMap[r.id] ? { ...r, image: imageMap[r.id] } : r);
    if (!s.intervalWeeks) s.intervalWeeks = 1;
    if (!s.cyclePlans)    s.cyclePlans = {};
    if (!s.settings)      s.settings = { dayConstraints: {} };
    return s;
  }

  if (serverState && serverTime >= localTime) {
    // Server state is current — adopt it
    state = mergeRecipes(serverState);
    saveState(state);
  } else if (localTime > serverTime) {
    // Local state is newer (e.g. server restarted) — push it back to server
    state = mergeRecipes(localState);
    saveState(state);
    persist(); // re-sync localStorage → server
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

  // Header-Hamburger (nur Einstellungen)
  document.getElementById('fab-main').addEventListener('click', () => {
    document.getElementById('header-menu').classList.toggle('open');
  });
  document.addEventListener('click', e => {
    const hm = document.getElementById('header-menu');
    if (hm && hm.classList.contains('open') && !hm.contains(e.target)) {
      hm.classList.remove('open');
    }
    const fab = document.getElementById('fab-plan');
    if (fab && fab.classList.contains('open') && !fab.contains(e.target)) {
      fab.classList.remove('open');
    }
  });

  // Bottom FAB (Reset + Wizard)
  document.getElementById('fab-plan-btn').addEventListener('click', () => {
    document.getElementById('fab-plan').classList.toggle('open');
  });

  // Auto-fill buttons
  document.getElementById('btn-autofill').addEventListener('click', () => {
    document.getElementById('fab-plan').classList.remove('open');
    autoFillPlan();
  });
  document.getElementById('btn-autofill-all').addEventListener('click', () => {
    document.getElementById('fab-plan').classList.remove('open');
    autoFillAll();
  });
  document.getElementById('btn-fab-settings').addEventListener('click', () => {
    document.getElementById('header-menu').classList.remove('open');
    showView('settings');
  });

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

  // Image picker for new recipe
  document.getElementById('rf-img-btn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
          const MAX = 900;
          const scale = img.width > MAX ? MAX / img.width : 1;
          const canvas = document.createElement('canvas');
          canvas.width  = Math.round(img.width  * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          newRecipeImageData = canvas.toDataURL('image/jpeg', 0.82);
          document.getElementById('rf-img-preview').src = newRecipeImageData;
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };
    input.click();
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

  // Pull-to-Refresh
  initPullToRefresh();

  // Meal Drag & Drop
  initMealDrag();

  // Back-to-Top visibility on scroll (nur im Rezepte-View)
  const _bttBtn = document.getElementById('btn-back-to-top');
  window.addEventListener('scroll', () => {
    if (_bttBtn) {
      const show = currentView === 'recipes' && window.scrollY > window.innerHeight * 0.4;
      _bttBtn.classList.toggle('visible', show);
    }
  }, { passive: true });

  // Initial render — gespeicherte View wiederherstellen
  const _savedView = localStorage.getItem('ff_last_view');
  const _validViews = ['plan', 'recipes', 'shopping', 'settings'];
  showView(_validViews.includes(_savedView) ? _savedView : 'plan');
});

// ─── Pull-to-Refresh ─────────────────────────────────────────────────────────
function initPullToRefresh() {
  const THRESHOLD = 300;
  let startY = 0;
  let pulling = false;

  const indicator = document.createElement('div');
  indicator.className = 'ptr-indicator';
  indicator.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.61"/></svg>';
  document.body.appendChild(indicator);

  document.addEventListener('touchstart', e => {
    startY = 0;
    pulling = false;
    const scrollable = e.target.closest('.modal-list, .recipe-form-body');
    if (scrollable) return;
    const activeContent = document.querySelector('.view.active .main-content');
    if (activeContent && activeContent.scrollTop > 0) return;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (touchDragSrc) return; // no PTR during meal drag
    if (!startY) return;
    const dy = e.touches[0].clientY - startY;
    if (dy < 20) return;
    const scrollable = e.target.closest('.modal-list, .recipe-form-body');
    if (scrollable) return;
    const activeContent = document.querySelector('.view.active .main-content');
    if (!activeContent || activeContent.scrollTop > 0) return;
    pulling = true;
    const yOffset = Math.min(dy * 0.45, 48);
    indicator.classList.add('ptr-pulling');
    indicator.style.transform = `translateX(-50%) translateY(${yOffset - 60}px)`;
    const rotation = Math.min((dy / THRESHOLD) * 180, 180);
    indicator.querySelector('svg').style.transform = `rotate(${rotation}deg)`;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (!pulling) { startY = 0; return; }
    const dy = e.changedTouches[0].clientY - startY;
    pulling = false;
    startY = 0;
    if (dy >= THRESHOLD) {
      indicator.classList.remove('ptr-pulling');
      indicator.classList.add('ptr-loading');
      setTimeout(() => location.reload(), 500);
    } else {
      indicator.classList.remove('ptr-pulling');
      indicator.style.transform = '';
    }
  }, { passive: true });

  document.addEventListener('touchcancel', () => {
    pulling = false;
    startY = 0;
    indicator.classList.remove('ptr-pulling', 'ptr-loading');
    indicator.style.transform = '';
  }, { passive: true });
}
