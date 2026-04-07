// ── Map setup ───────────────────────────────────────────────────────────────
const map = L.map('map', {
  center: [39.19, -84.43],
  zoom: 11,
  scrollWheelZoom: false
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19
}).addTo(map);

function makeIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
            fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [24, 36], iconAnchor: [12, 36], popupAnchor: [0, -36] });
}

const crimeColors = { safe: '#27ae60', moderate: '#e67e22', elevated: '#c0392b' };
const markers = [];

neighborhoods.forEach(n => {
  const marker = L.marker([n.lat, n.lng], { icon: makeIcon(crimeColors[n.crimeLevel]) }).addTo(map);
  marker.bindPopup('', { maxWidth: 240 });
  markers.push(marker);
});

// ── Destination marker (11511 Reed Hartman Hwy, Blue Ash) ───────────────────
const destIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 11.25 16 26 16 26S32 27.25 32 16C32 7.163 24.837 0 16 0z"
          fill="#1a237e" stroke="#fff" stroke-width="2"/>
    <text x="16" y="21" text-anchor="middle" font-size="14" font-family="sans-serif" fill="white" font-weight="bold">&#9733;</text>
  </svg>`,
  className: '',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -44]
});

L.marker([39.2431, -84.3813], { icon: destIcon, zIndexOffset: 1000 })
  .addTo(map)
  .bindPopup(`
    <div class="map-popup">
      <h3>&#9733; Your Destination</h3>
      <p style="font-weight:600;">11511 Reed Hartman Hwy</p>
      <p>Blue Ash, OH 45241</p>
      <p style="font-size:0.75rem;color:#888;margin-top:4px;">Drive times shown on each card are to this location</p>
    </div>
  `, { maxWidth: 220 });

// ── Scoring ──────────────────────────────────────────────────────────────────
// Weighted min-max normalization across 4 metrics.
// Weights are raw values (0–100); they are normalized internally so they sum to 1.
const crimeNumeric = { safe: 100, moderate: 50, elevated: 0 };

function computeScores(weights) {
  const t = (weights.price + weights.crime + weights.walk + weights.drive) || 1;
  const w = {
    price: weights.price / t,
    crime: weights.crime / t,
    walk:  weights.walk  / t,
    drive: weights.drive / t
  };

  const prices = neighborhoods.map(n => n.priceMax);
  const walks  = neighborhoods.map(n => n.walkScore);
  const drives = neighborhoods.map(n => n.driveMin);

  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const minW = Math.min(...walks),  maxW = Math.max(...walks);
  const minD = Math.min(...drives), maxD = Math.max(...drives);

  return neighborhoods.map(n => {
    const ps = 100 - (n.priceMax - minP) / (maxP - minP) * 100;  // lower price = higher
    const cs = crimeNumeric[n.crimeLevel];                         // safe=100, moderate=50, elevated=0
    const ws = (n.walkScore - minW) / (maxW - minW) * 100;        // higher walk = higher
    const ds = 100 - (n.driveMin  - minD) / (maxD - minD) * 100; // shorter drive = higher
    return Math.round(w.price * ps + w.crime * cs + w.walk * ws + w.drive * ds);
  });
}

let currentScores = computeScores({ price: 30, crime: 25, walk: 20, drive: 25 });

// ── Build cards ─────────────────────────────────────────────────────────────
const crimeClass = { safe: 'crime-safe', moderate: 'crime-moderate', elevated: 'crime-elevated' };
const crimeLabel = { safe: 'Low Crime', moderate: 'Moderate Crime', elevated: 'Elevated Crime' };
const crimeIcon  = { safe: '✔', moderate: '~', elevated: '!' };

const grid = document.getElementById('grid');
const cardEls = [];

neighborhoods.forEach((n, i) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.setProperty('--accent-color', n.color);

  const walkPct = Math.min(100, n.walkScore);
  const score = currentScores[i];
  const scoreTier = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low';
  card.style.order = String(-score);

  card.innerHTML = `
    <div class="card-header">
      <div>
        <h2>${n.name}</h2>
        <div class="card-type">${n.type}</div>
      </div>
      <div class="score-badge score-${scoreTier}" id="score-badge-${i}" title="Composite score (0–100) based on current weights">${score}</div>
    </div>
    <div class="card-body">

      <div class="stat">
        <div class="stat-icon">&#127968;</div>
        <div class="stat-content">
          <div class="stat-label">Avg. Home Price</div>
          <div class="stat-value price-value">${n.price}</div>
        </div>
      </div>

      <div class="stat">
        <div class="stat-icon">&#128737;</div>
        <div class="stat-content">
          <div class="stat-label">Crime &amp; Safety</div>
          <div class="stat-value" style="margin-bottom:4px;">
            <span class="crime-badge ${crimeClass[n.crimeLevel]}">${crimeIcon[n.crimeLevel]} ${crimeLabel[n.crimeLevel]}</span>
          </div>
          <div style="font-size:0.78rem;color:var(--muted);font-family:sans-serif;">${n.crimeSummary}</div>
        </div>
      </div>

      <div class="stat">
        <div class="stat-icon">&#128694;</div>
        <div class="stat-content">
          <div class="stat-label">Walk Score — ${n.walkLabel}</div>
          <div class="walk-bar-wrap">
            <div class="walk-bar-bg">
              <div class="walk-bar-fill" style="width:${walkPct}%"></div>
            </div>
            <div class="walk-score-num">${n.walkScore}<span style="font-weight:normal;color:#999;font-size:0.7rem;">/100</span></div>
          </div>
        </div>
      </div>

      <div class="stat">
        <div class="stat-icon">&#128663;</div>
        <div class="stat-content">
          <div class="stat-label">Drive to Blue Ash</div>
          <div class="stat-value">~${n.driveMin} min <span style="font-size:0.8rem;color:var(--muted);font-family:sans-serif;">to Reed Hartman Hwy</span></div>
        </div>
      </div>

      <div class="stat">
        <div class="stat-icon">&#127970;</div>
        <div class="stat-content">
          <div class="stat-label">Community Highlights</div>
          <ul class="community-list">
            ${n.community.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>

    </div>
  `;

  grid.appendChild(card);
  cardEls.push(card);
});

// ── Filter logic ────────────────────────────────────────────────────────────
const elCountShown = document.getElementById('count-shown');
const elCountTotal = document.getElementById('count-total');
const elValPrice   = document.getElementById('val-price');
const elValWalk    = document.getElementById('val-walk');
const elValDrive   = document.getElementById('val-drive');
const sliderPrice  = document.getElementById('filter-price');
const sliderWalk   = document.getElementById('filter-walk');
const sliderDrive  = document.getElementById('filter-drive');

elCountTotal.textContent = neighborhoods.length;

const crimeOrder = { safe: 0, moderate: 1, elevated: 2 };

function applyFilters() {
  const maxPrice  = parseInt(sliderPrice.value, 10);
  const minWalk   = parseInt(sliderWalk.value, 10);
  const maxDrive  = parseInt(sliderDrive.value, 10);
  const crimeMode = document.querySelector('input[name="crime"]:checked').value;

  elValPrice.textContent = maxPrice >= 1100 ? 'Any' : `$${maxPrice}K`;
  elValWalk.textContent  = minWalk === 0    ? 'Any' : minWalk;
  elValDrive.textContent = maxDrive >= 60   ? 'Any' : `${maxDrive} min`;

  let shown = 0;

  neighborhoods.forEach((n, i) => {
    let visible = true;
    if (maxPrice < 1100 && n.priceMax > maxPrice) visible = false;
    if (minWalk > 0 && n.walkScore < minWalk) visible = false;
    if (maxDrive < 60 && n.driveMin > maxDrive) visible = false;
    if (crimeMode === 'safe'     && n.crimeLevel !== 'safe') visible = false;
    if (crimeMode === 'moderate' && crimeOrder[n.crimeLevel] > 1) visible = false;

    if (visible) {
      cardEls[i].classList.remove('hidden');
      if (!map.hasLayer(markers[i])) markers[i].addTo(map);
      shown++;
    } else {
      cardEls[i].classList.add('hidden');
      if (map.hasLayer(markers[i])) markers[i].remove();
    }
  });

  let emptyEl = grid.querySelector('.no-results');
  if (shown === 0) {
    if (!emptyEl) {
      emptyEl = document.createElement('div');
      emptyEl.className = 'no-results';
      emptyEl.innerHTML = '<strong>No neighborhoods match your filters.</strong> Try widening your criteria using the sliders above.';
      grid.appendChild(emptyEl);
    }
  } else if (emptyEl) {
    emptyEl.remove();
  }

  elCountShown.textContent = shown;
}

sliderPrice.addEventListener('input', applyFilters);
sliderWalk.addEventListener('input', applyFilters);
sliderDrive.addEventListener('input', applyFilters);
document.querySelectorAll('input[name="crime"]').forEach(r => r.addEventListener('change', applyFilters));

// ── Score weight logic ───────────────────────────────────────────────────────
const wSliderPrice = document.getElementById('w-price');
const wSliderCrime = document.getElementById('w-crime');
const wSliderWalk  = document.getElementById('w-walk');
const wSliderDrive = document.getElementById('w-drive');

function updateScores() {
  const rp = parseInt(wSliderPrice.value, 10);
  const rc = parseInt(wSliderCrime.value, 10);
  const rw = parseInt(wSliderWalk.value,  10);
  const rd = parseInt(wSliderDrive.value, 10);
  const rt = (rp + rc + rw + rd) || 1;

  document.getElementById('w-val-price').textContent = Math.round(rp / rt * 100) + '%';
  document.getElementById('w-val-crime').textContent = Math.round(rc / rt * 100) + '%';
  document.getElementById('w-val-walk').textContent  = Math.round(rw / rt * 100) + '%';
  document.getElementById('w-val-drive').textContent = Math.round(rd / rt * 100) + '%';

  currentScores = computeScores({ price: rp, crime: rc, walk: rw, drive: rd });

  currentScores.forEach((score, i) => {
    const tier = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low';
    const badge = document.getElementById(`score-badge-${i}`);
    badge.textContent = score;
    badge.className = `score-badge score-${tier}`;
    cardEls[i].style.order = String(-score);

    const n = neighborhoods[i];
    markers[i].getPopup().setContent(`
      <div class="map-popup">
        <h3>${n.name}</h3>
        <p>${n.type}</p>
        <p class="mp-price">${n.price}</p>
        <p>Walk Score: <strong>${n.walkScore}</strong> — ${n.walkLabel}</p>
        <p>Drive to Blue Ash: <strong>~${n.driveMin} min</strong></p>
        <p style="margin-top:4px;font-size:0.75rem;color:#888;">${n.crimeSummary}</p>
        <p style="margin-top:6px;font-family:sans-serif;font-weight:700;color:var(--accent2);">Score: ${score}/100</p>
      </div>
    `);
  });
}

wSliderPrice.addEventListener('input', updateScores);
wSliderCrime.addEventListener('input', updateScores);
wSliderWalk.addEventListener('input',  updateScores);
wSliderDrive.addEventListener('input', updateScores);

document.getElementById('btn-reset').addEventListener('click', () => {
  sliderPrice.value = 1100;
  sliderWalk.value  = 0;
  sliderDrive.value = 60;
  document.getElementById('crime-all').checked = true;
  wSliderPrice.value = 30;
  wSliderCrime.value = 25;
  wSliderWalk.value  = 20;
  wSliderDrive.value = 25;
  updateScores();
  applyFilters();
});

updateScores();
applyFilters();
