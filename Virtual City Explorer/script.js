/* Virtual City Explorer – vanilla JS. Sections: config, demo data, api, favorites, ui, search, init */
'use strict';
const $ = (s, r = document) => r.querySelector(s);

/* ========== 1. API CONFIGURATION ========== */
// All APIs below are public and need no key. If you switch to a keyed map
// provider (e.g. Mapbox/Google), put the key here – never commit real keys.
const CONFIG = {
  MAP_API_KEY: '',
  geo: 'https://geocoding-api.open-meteo.com/v1/search',
  weather: 'https://api.open-meteo.com/v1/forecast',
  wiki: 'https://en.wikipedia.org/api/rest_v1/page/summary/',
  overpass: 'https://overpass-api.de/api/interpreter',
  timeout: 8000
};

/* ========== 2. DEMO / FALLBACK DATA (not real-time) ========== */
const W = (t, f, h, w, v, sr, ss, r, code) => ({ t, f, h, w, v, sr, ss, r, code });
const DEMO = {
  mumbai: { name: 'Mumbai', country: 'India', lat: 19.076, lon: 72.878, tz: 'Asia/Kolkata', desc: 'India’s coastal megacity: sea promenades, street food and Bollywood glamour.', vibes: ['🌊 Coastal', '🍜 Foodie', '🌃 Nightlife', '🏛 Historical'], w: W(31, 34, 74, 14, 6, '06:35', '18:50', 20, 2),
    places: [['Marine Drive', 'Attractions', 4.7, 'Nariman Point', 'Curved sea promenade, best at sunset.', 18.943, 72.823], ['Gateway of India', 'Attractions', 4.6, 'Colaba', 'Iconic harbour-side arch from 1924.', 18.922, 72.834], ['Leopold Cafe', 'Cafes', 4.2, 'Colaba', 'Historic cafe loved by travellers.', 18.923, 72.832], ['Sanjay Gandhi National Park', 'Parks', 4.5, 'Borivali', 'Forest park inside the city.', 19.215, 72.911], ['Bandra Street Food', 'Food', 4.4, 'Bandra', 'Vada pav, pav bhaji and more.', 19.06, 72.836], ['Phoenix Marketcity', 'Shopping', 4.3, 'Kurla', 'Large mall with cinemas and dining.', 19.087, 72.889]] },
  delhi: { name: 'Delhi', country: 'India', lat: 28.614, lon: 77.209, tz: 'Asia/Kolkata', desc: 'Mughal monuments, bustling markets and legendary food lanes.', vibes: ['🏛 Historical', '🎨 Cultural', '🍜 Foodie'], w: W(33, 36, 45, 12, 5, '06:00', '18:20', 10, 1),
    places: [['Red Fort', 'Attractions', 4.5, 'Old Delhi', 'UNESCO-listed Mughal fort.', 28.656, 77.241], ['Lodhi Garden', 'Parks', 4.6, 'Lodhi Road', 'Tombs and lawns for calm walks.', 28.593, 77.22], ['Chandni Chowk', 'Food', 4.4, 'Old Delhi', 'Parathas, chaat and sweets.', 28.656, 77.23], ['Khan Market', 'Shopping', 4.4, 'Khan Market', 'Bookshops, boutiques and cafes.', 28.6, 77.227], ['Triveni Kala Cafe', 'Cafes', 4.3, 'Mandi House', 'Art-space cafe with a courtyard.', 28.626, 77.234]] },
  goa: { name: 'Goa', country: 'India', lat: 15.299, lon: 74.124, tz: 'Asia/Kolkata', desc: 'Beaches, Portuguese churches and a laid-back coastal rhythm.', vibes: ['🌊 Coastal', '🌃 Nightlife', '🌿 Relaxing'], w: W(30, 34, 80, 15, 7, '06:25', '18:35', 25, 2),
    places: [['Baga Beach', 'Attractions', 4.4, 'Baga', 'Water sports and beach shacks.', 15.555, 73.752], ['Basilica of Bom Jesus', 'Attractions', 4.6, 'Old Goa', 'Baroque church and heritage site.', 15.501, 73.911], ['Fontainhas Quarter', 'Cafes', 4.5, 'Panaji', 'Colourful Latin quarter with cafes.', 15.498, 73.832], ['Mapusa Market', 'Shopping', 4.2, 'Mapusa', 'Spices, cashews and crafts.', 15.591, 73.808], ['Fisherman’s Wharf', 'Food', 4.3, 'Cavelossim', 'Goan seafood by the river.', 15.17, 73.94]] },
  bengaluru: { name: 'Bengaluru', country: 'India', lat: 12.972, lon: 77.595, tz: 'Asia/Kolkata', desc: 'India’s garden city: parks, craft breweries and a big start-up scene.', vibes: ['🌿 Relaxing', '🍜 Foodie', '🎨 Cultural'], w: W(26, 27, 65, 11, 8, '06:10', '18:25', 30, 3),
    places: [['Lalbagh Botanical Garden', 'Parks', 4.6, 'Lalbagh', 'Glasshouse and century-old trees.', 12.951, 77.585], ['Bangalore Palace', 'Attractions', 4.4, 'Vasanth Nagar', 'Tudor-style royal palace.', 12.998, 77.592], ['Toit Brewpub', 'Food', 4.5, 'Indiranagar', 'Popular craft-beer pub.', 12.979, 77.64], ['Third Wave Coffee', 'Cafes', 4.3, 'Koramangala', 'Specialty coffee hangout.', 12.935, 77.624], ['Commercial Street', 'Shopping', 4.2, 'Shivajinagar', 'Busy street for clothes and gifts.', 12.982, 77.608]] },
  jaipur: { name: 'Jaipur', country: 'India', lat: 26.912, lon: 75.787, tz: 'Asia/Kolkata', desc: 'The Pink City of forts, palaces and block-print bazaars.', vibes: ['🏛 Historical', '🎨 Cultural', '🍜 Foodie'], w: W(34, 37, 35, 13, 6, '06:05', '18:30', 5, 0),
    places: [['Amber Fort', 'Attractions', 4.7, 'Amer', 'Hilltop fort with mirror halls.', 26.985, 75.851], ['Hawa Mahal', 'Attractions', 4.5, 'Old City', 'Honeycomb facade of 953 windows.', 26.924, 75.827], ['Johari Bazaar', 'Shopping', 4.4, 'Old City', 'Jewellery and textile market.', 26.919, 75.826], ['Rawat Mishthan Bhandar', 'Food', 4.4, 'Station Road', 'Famous pyaaz kachori.', 26.917, 75.801], ['Central Park', 'Parks', 4.3, 'C-Scheme', 'Jogging tracks and open lawns.', 26.903, 75.805]] },
  london: { name: 'London', country: 'United Kingdom', lat: 51.507, lon: -0.128, tz: 'Europe/London', desc: 'Royal parks, world-class museums and a river full of history.', vibes: ['🏛 Historical', '🎨 Cultural', '🌃 Nightlife'], w: W(16, 14, 72, 18, 9, '06:55', '18:40', 55, 3),
    places: [['British Museum', 'Attractions', 4.7, 'Bloomsbury', 'Free world-history collection.', 51.519, -0.127], ['Hyde Park', 'Parks', 4.6, 'Westminster', 'Lake, gardens and Speakers’ Corner.', 51.507, -0.165], ['Borough Market', 'Food', 4.6, 'Southwark', 'Food stalls since the 1700s.', 51.505, -0.091], ['Covent Garden', 'Shopping', 4.4, 'Covent Garden', 'Street performers and shops.', 51.512, -0.123], ['Monmouth Coffee', 'Cafes', 4.5, 'Borough', 'Beloved roastery cafe.', 51.505, -0.09]] },
  paris: { name: 'Paris', country: 'France', lat: 48.857, lon: 2.352, tz: 'Europe/Paris', desc: 'Cafe terraces, grand boulevards and art on every corner.', vibes: ['🎨 Cultural', '🍜 Foodie', '🏛 Historical', '🌃 Nightlife'], w: W(18, 17, 68, 12, 10, '07:15', '19:10', 35, 3),
    places: [['Eiffel Tower', 'Attractions', 4.6, '7th arr.', 'Iron icon with city views.', 48.858, 2.294], ['Louvre Museum', 'Attractions', 4.7, '1st arr.', 'Home of the Mona Lisa.', 48.861, 2.336], ['Luxembourg Gardens', 'Parks', 4.7, '6th arr.', 'Formal gardens and boat pond.', 48.846, 2.337], ['Café de Flore', 'Cafes', 4.2, 'Saint-Germain', 'Historic literary cafe.', 48.854, 2.333], ['Le Marais', 'Food', 4.5, '4th arr.', 'Falafel, patisseries and bistros.', 48.857, 2.36]] },
  tokyo: { name: 'Tokyo', country: 'Japan', lat: 35.676, lon: 139.65, tz: 'Asia/Tokyo', desc: 'Neon nights, quiet shrines and some of the world’s best food.', vibes: ['🌃 Nightlife', '🍜 Foodie', '🎨 Cultural', '🏛 Historical'], w: W(24, 25, 60, 10, 10, '05:35', '17:30', 20, 1),
    places: [['Senso-ji Temple', 'Attractions', 4.6, 'Asakusa', 'Tokyo’s oldest temple.', 35.715, 139.797], ['Shinjuku Gyoen', 'Parks', 4.6, 'Shinjuku', 'Large garden, great in autumn.', 35.685, 139.71], ['Tsukiji Outer Market', 'Food', 4.4, 'Chuo', 'Sushi and street snacks.', 35.665, 139.77], ['Shibuya Sky Cafe', 'Cafes', 4.4, 'Shibuya', 'Coffee near the famous crossing.', 35.659, 139.702], ['Ginza', 'Shopping', 4.5, 'Chuo', 'Department stores and boutiques.', 35.672, 139.765]] }
};
const key = n => n.trim().toLowerCase();
const CATS = ['All', 'Attractions', 'Food', 'Cafes', 'Hotels', 'Parks', 'Shopping'];
const ICON = { Attractions: '🏛', Food: '🍜', Cafes: '☕', Hotels: '🏨', Parks: '🌿', Shopping: '🛍' };
const GRAD = { Attractions: ['#3b4fd8', '#8a4fd8'], Food: ['#d8643b', '#d8a23b'], Cafes: ['#7a4a2e', '#c08a5a'], Hotels: ['#2e7a8a', '#3b4fd8'], Parks: ['#2e8a5a', '#8ad84f'], Shopping: ['#d83b8a', '#d8643b'] };

/* ========== 3. WEATHER & CITY API FUNCTIONS ========== */
async function getJSON(url, opts = {}) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), CONFIG.timeout);
  try { const r = await fetch(url, { ...opts, signal: ctl.signal }); if (!r.ok) throw new Error(r.status); return await r.json(); }
  finally { clearTimeout(t); }
}
/* Returns {name,country,lat,lon,tz} or null (not found). Throws on network failure. */
async function geocode(q) {
  const d = await getJSON(`${CONFIG.geo}?name=${encodeURIComponent(q)}&count=1&language=en`);
  const r = d.results && d.results[0];
  return r ? { name: r.name, country: r.country || '', lat: r.latitude, lon: r.longitude, tz: r.timezone || 'UTC' } : null;
}
async function fetchWeather(c) {
  const u = `${CONFIG.weather}?latitude=${c.lat}&longitude=${c.lon}&timezone=auto&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&hourly=visibility&forecast_hours=1&daily=sunrise,sunset,precipitation_probability_max&forecast_days=1`;
  const d = await getJSON(u), c1 = d.current;
  return { t: Math.round(c1.temperature_2m), f: Math.round(c1.apparent_temperature), h: c1.relative_humidity_2m, w: Math.round(c1.wind_speed_10m),
    v: Math.round((d.hourly.visibility[0] || 10000) / 1000), sr: d.daily.sunrise[0].slice(11), ss: d.daily.sunset[0].slice(11),
    r: d.daily.precipitation_probability_max[0] || 0, code: c1.weather_code, tz: d.timezone };
}
async function fetchWiki(name) {
  const d = await getJSON(CONFIG.wiki + encodeURIComponent(name));
  return { desc: (d.extract || '').split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.'), img: d.thumbnail ? d.thumbnail.source : '' };
}
/* Weather code -> label, icon, kind (sunny | cloudy | rainy) */
function describeWeather(code) {
  if (code <= 1) return { text: 'Clear sky', icon: '☀️', kind: 'sunny' };
  if (code <= 3) return { text: 'Partly cloudy', icon: '⛅', kind: 'cloudy' };
  if (code <= 48) return { text: 'Foggy', icon: '🌫', kind: 'cloudy' };
  if (code <= 67 || (code >= 80 && code <= 82)) return { text: 'Rain', icon: '🌧', kind: 'rainy' };
  if (code <= 77) return { text: 'Snow', icon: '❄️', kind: 'rainy' };
  return { text: 'Thunderstorm', icon: '⛈', kind: 'rainy' };
}
const MOOD = { sunny: 'Clear skies — perfect for outdoor exploration.', cloudy: 'Soft cloud cover — great for photos and wandering markets.', rainy: 'Rainy conditions — explore indoor attractions and cafes.' };
const TODO = { sunny: ['🏖 Beach or waterfront', '🌳 Park picnic', '🔭 Outdoor sightseeing', '🚶 Walking tour'], cloudy: ['📷 Photography walk', '🏛 Historical places', '🧺 Local market'], rainy: ['🖼 Museum', '☕ Cosy cafe', '🛍 Shopping mall', '🎭 Indoor attraction'] };

/* ========== 4. PLACES FUNCTIONS ========== */
/* Real places from OpenStreetMap (Overpass). Rating is not provided by OSM. */
async function fetchPlaces(c) {
  const a = `(around:6000,${c.lat},${c.lon})`;
  const q = `[out:json][timeout:10];(node[tourism~"attraction|museum"][name]${a};node[amenity=restaurant][name]${a};node[amenity=cafe][name]${a};node[tourism=hotel][name]${a};node[leisure=park][name]${a};node[shop=mall][name]${a};);out 45;`;
  const d = await getJSON(CONFIG.overpass, { method: 'POST', body: 'data=' + encodeURIComponent(q) });
  return d.elements.map(e => {
    const t = e.tags, cat = t.amenity === 'restaurant' ? 'Food' : t.amenity === 'cafe' ? 'Cafes' : t.tourism === 'hotel' ? 'Hotels' : t.leisure === 'park' ? 'Parks' : t.shop ? 'Shopping' : 'Attractions';
    return { name: t.name, cat, rating: null, area: t['addr:suburb'] || t['addr:city'] || '', desc: t.description || `${cat === 'Attractions' ? 'Local attraction' : cat.slice(0, -1) || cat} worth a look.`, lat: e.lat, lon: e.lon };
  }).slice(0, 36);
}
const demoPlaces = city => (city.places || []).map(p => ({ name: p[0], cat: p[1], rating: p[2], area: p[3], desc: p[4], lat: p[5], lon: p[6] }));
const placeId = p => `${p.name}|${p.lat}`;

/* Plan My Day: Morning (outdoor) -> Afternoon (weather-aware) -> Evening (food/cafe) */
function planDay(places, kind) {
  const pick = cats => places.find(p => cats.includes(p.cat)) || places[0];
  const used = new Set(), one = cats => { const l = places.filter(p => cats.includes(p.cat) && !used.has(p.name)); const p = l[0] || places.find(p => !used.has(p.name)); if (p) used.add(p.name); return p ? p.name : 'Free exploring'; };
  const am = one(kind === 'rainy' ? ['Cafes', 'Attractions'] : ['Parks', 'Attractions']);
  const pm = one(kind === 'rainy' ? ['Shopping', 'Attractions'] : ['Attractions', 'Shopping']);
  const pmEve = one(['Food', 'Cafes']);
  return [['Morning', am], ['Afternoon', pm], ['Evening', pmEve]];
}

/* Smart Packing List: built from the city's live weather */
function packList(w, kind) {
  const l = ['🪪 ID & charger'];
  if (w.t >= 30) l.push('🧴 Sunscreen', '🕶 Sunglasses', '💧 Water bottle');
  else if (w.t >= 20) l.push('👕 Light cottons', '🕶 Sunglasses');
  else if (w.t >= 10) l.push('🧥 Jacket', '👖 Full pants');
  else l.push('🧣 Heavy coat', '🧤 Gloves');
  if (kind === 'rainy' || w.r >= 50) l.push('☂️ Umbrella', '🥾 Water-resistant shoes');
  if (w.h >= 75) l.push('👚 Quick-dry clothes');
  if (w.w >= 25) l.push('🌬 Windcheater');
  return l;
}
/* City Compare: loads a second city and shows a side-by-side table */
async function compareCity(raw) {
  const out = $('#cmpOut'), q = raw.trim();
  if (!q) { out.innerHTML = '<p class="empty">Type a city to compare.</p>'; return; }
  out.innerHTML = '<p class="empty">Comparing…</p>';
  try {
    const b = DEMO[key(q)] || await geocode(q); if (!b) throw 0;
    const bw = await fetchWeather(b).catch(() => (DEMO[key(b.name)] || {}).w); if (!bw) throw 0;
    const a = state.w, d = a.t - bw.t, A = state.city.name;
    const rows = [['🌡 Temp', 't', '°C'], ['🤒 Feels like', 'f', '°C'], ['💧 Humidity', 'h', '%'], ['💨 Wind', 'w', ' km/h'], ['🌧 Rain chance', 'r', '%']];
    out.innerHTML = `<table class="cmp"><tr><th></th><th>${esc(A)}</th><th>${esc(b.name)}</th></tr>${rows.map(([l, k, u]) => `<tr><th>${l}</th><td>${a[k]}${u}</td><td>${bw[k]}${u}</td></tr>`).join('')}</table>
      <p class="mood">${d === 0 ? 'Both cities feel the same right now.' : esc(d > 0 ? A : b.name) + ' is warmer by ' + Math.abs(d) + '°C.'}</p>`;
  } catch { out.innerHTML = '<p class="empty">Couldn’t compare. Check the city name or your connection.</p>'; }
}

/* ========== 5. FAVORITES (localStorage) ========== */
const FAV_KEY = 'vce_favorites';
const favs = {
  all() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; } },
  save(a) { try { localStorage.setItem(FAV_KEY, JSON.stringify(a)); } catch { /* storage blocked */ } },
  has(p) { return this.all().some(f => placeId(f) === placeId(p)); },
  toggle(p) { const a = this.all(), i = a.findIndex(f => placeId(f) === placeId(p)); i >= 0 ? a.splice(i, 1) : a.push(p); this.save(a); $('#favCount').textContent = a.length; }
};

/* ========== 6. UI RENDERING ========== */
const state = { city: null, places: [], cat: 'All', last: null };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === id));
  document.querySelectorAll('.nav nav button').forEach(b => b.classList.toggle('on', b.dataset.view === id || (id === 'dashboard' && b.dataset.view === 'discover')));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function placeCard(p, i) {
  const [c1, c2] = GRAD[p.cat] || GRAD.Attractions, on = favs.has(p);
  return `<article class="place"><div class="art" style="--c1:${c1};--c2:${c2}">${ICON[p.cat] || '📍'}</div>
  <div class="pbody"><div class="prow"><h4>${esc(p.name)}</h4><button class="heart" data-fav="${i}" aria-label="Toggle favorite" aria-pressed="${on}">${on ? '❤️' : '🤍'}</button></div>
  <small>${esc(p.cat)} · ${p.rating ? '★ ' + p.rating : 'Local pick'}${p.area ? ' · ' + esc(p.area) : ''}</small><p>${esc(p.desc)}</p>
  <button class="link" data-map="${i}">View on Map</button></div></article>`;
}
function renderPlaces() {
  const list = state.places.filter(p => state.cat === 'All' || p.cat === state.cat);
  $('#placeGrid').innerHTML = list.length ? list.map(p => placeCard(p, state.places.indexOf(p))).join('') : '<p class="empty">No places found in this category. Try another filter.</p>';
  document.querySelectorAll('#filters .chip').forEach(b => b.classList.toggle('on', b.dataset.cat === state.cat));
}
function renderMap(lat, lon, label) {
  const d = 0.04, src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d},${lat - d},${lon + d},${lat + d}&layer=mapnik&marker=${lat},${lon}`;
  const link = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`;
  $('#mapBox').innerHTML = navigator.onLine
    ? `<iframe title="Map of ${esc(label)}" src="${src}" loading="lazy"></iframe>`
    : `<div class="mapfall">📍 ${esc(label)}<br>${lat.toFixed(3)}, ${lon.toFixed(3)}<br>Map unavailable offline.</div>`;
  $('#mapLink').href = link; $('#mapLabel').textContent = label;
}
function animateNumbers() {
  document.querySelectorAll('[data-n]').forEach(el => {
    const end = +el.dataset.n, t0 = performance.now();
    (function step(t) { const k = Math.min((t - t0) / 900, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + (el.dataset.u || ''); if (k < 1) requestAnimationFrame(step); })(t0);
  });
}
function renderDashboard(c, w, desc, img, places, demo) {
  const wx = describeWeather(w.code), kind = wx.kind;
  state.city = c; state.places = places; state.cat = 'All'; state.w = w;
  $('#cName').textContent = c.name; $('#cCountry').textContent = c.country; $('#demoNote').hidden = !demo;
  const bg = img ? `background-image:url('${esc(img)}')` : 'background:linear-gradient(135deg,#243b8f,#8a5a2e)';
  const stat = (ic, l, n, u) => `<div class="stat"><span>${ic} ${l}</span><b data-n="${n}" data-u="${u}">0${u}</b></div>`;
  $('#dashBody').innerHTML = `
  <div class="bento">
    <div class="card cityhero c8" style="${bg}"><div class="temp">${wx.icon} ${w.t}°C</div><h2>${esc(c.name)}</h2><p>${esc(desc)}</p><span>${wx.text}</span></div>
    <div class="card c4"><h3>Weather</h3><div class="wlist"><span>Feels like<b>${w.f}°C</b></span><span>Humidity<b>${w.h}%</b></span><span>Wind<b>${w.w} km/h</b></span><span>Visibility<b>${w.v} km</b></span><span>Sunrise<b>${w.sr}</b></span><span>Sunset<b>${w.ss}</b></span></div>
    <p class="mood"><small>Today’s City Mood</small><br>${MOOD[kind]}</p></div>
    <div class="card c12"><div class="stats">${stat('🌡', 'Temperature', w.t, '°')}${stat('🌧', 'Rain chance', w.r, '%')}${stat('💧', 'Humidity', w.h, '%')}${stat('💨', 'Wind km/h', w.w, '')}<div class="stat"><span>🌅 Sunrise</span><b>${w.sr}</b></div><div class="stat"><span>🌇 Sunset</span><b>${w.ss}</b></div></div></div>
    <div class="card c6"><h3>What should I do today?</h3><div class="todo">${TODO[kind].map(t => `<div>${t}</div>`).join('')}</div>
      <button class="btn" id="planBtn" style="margin-top:16px">Plan My Day</button><div class="plan" id="plan"></div></div>
    <div class="card c6"><h3>🎒 Smart Packing List</h3><div class="tags">${packList(w, kind).map(i => `<span class="chip">${i}</span>`).join('')}</div></div>
    <div class="card c6"><h3>⚖️ Compare with another city</h3><div class="cmpbar"><input id="cmpInput" placeholder="e.g. Paris" aria-label="City to compare"><button class="btn" id="cmpBtn">Compare</button></div><div id="cmpOut"></div></div>
    <div class="card c6"><h3>City Vibe</h3><div class="tags">${(c.vibes || ['🌍 Explorable']).map(v => `<span class="chip">${v}</span>`).join('')}</div></div>
  </div>
  <h3 class="title">Explore the City</h3>
  <div class="filters" id="filters">${CATS.map(k => `<button class="chip" data-cat="${k}">${k}</button>`).join('')}</div>
  <div class="grid" id="placeGrid"></div>
  <div class="card" style="margin-top:22px"><div class="prow"><h3>Map · <span id="mapLabel"></span></h3><a class="link" id="mapLink" target="_blank" rel="noopener">Open full map</a></div><div class="mapbox" id="mapBox"></div></div>`;
  renderPlaces(); renderMap(c.lat, c.lon, c.name); animateNumbers(); startClock(w.tz || c.tz);
}
let clockTimer;
function startClock(tz) {
  clearInterval(clockTimer);
  const tick = () => { try { $('#cTime').textContent = new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' }); } catch { $('#cTime').textContent = ''; } };
  tick(); clockTimer = setInterval(tick, 30000);
}
function renderFavorites() {
  const a = favs.all();
  $('#favGrid').innerHTML = a.length ? a.map((p, i) => placeCard(p, i).replace('data-fav', 'data-unfav').replace('View on Map', 'Remove')).join('').replace(/data-map="\d+"/g, m => m.replace('map', 'rm')) : '<p class="empty">No favorites yet. Tap the heart on any place to save it here.</p>';
}
function showLoading(name) {
  $('#cName').textContent = name; $('#cCountry').textContent = ''; $('#cTime').textContent = ''; $('#demoNote').hidden = true;
  $('#dashBody').innerHTML = `<p class="loading">Exploring ${esc(name)}…</p><div class="bento"><div class="sk c8" style="grid-column:span 8;min-height:300px"></div><div class="sk" style="grid-column:span 4"></div></div><div class="grid">${'<div class="sk"></div>'.repeat(4)}</div>`;
  showView('dashboard');
}

/* ========== 7. SEARCH / LOAD CITY ========== */
async function loadCity(raw) {
  const q = (raw || '').trim(), msg = $('#searchMsg'); msg.textContent = '';
  if (!q) { msg.textContent = 'Please type a city name to start exploring.'; return; }
  const demo = DEMO[key(q)];
  showLoading(demo ? demo.name : q);
  let c = null, usedDemo = false;
  try { c = demo ? { ...demo } : await geocode(q); }
  catch { c = null; }
  if (!c) { // no match online, or network failure
    const fb = Object.values(DEMO).find(d => key(d.name) === key(q));
    if (!fb) { showView('home'); msg.textContent = 'We couldn’t find this city. Please try another search.'; return; }
    c = { ...fb };
  }
  const base = DEMO[key(c.name)];
  let w, info = { desc: '', img: '' }, places = [];
  try { w = await fetchWeather(c); } catch { w = null; }
  if (!w) { usedDemo = true; w = base ? { ...base.w, tz: base.tz } : { t: 25, f: 26, h: 60, w: 10, v: 8, sr: '06:00', ss: '18:30', r: 15, code: 1, tz: c.tz }; }
  try { info = await fetchWiki(c.name); } catch { /* use demo text */ }
  try { places = await fetchPlaces(c); } catch { places = []; }
  if (!places.length && base) { places = demoPlaces(base); usedDemo = true; }
  const desc = info.desc || (base && base.desc) || `Explore the sights and flavours of ${c.name}.`;
  state.last = c.name;
  renderDashboard(c, w, desc, info.img, places, usedDemo);
}

/* ========== 8. EVENTS & INIT ========== */
function init() {
  $('#chips').innerHTML = ['Mumbai', 'Delhi', 'Goa', 'Bengaluru', 'Jaipur', 'Paris', 'Tokyo'].map(n => `<button class="chip" data-city="${n}">${n}</button>`).join('');
  $('#favCount').textContent = favs.all().length;
  $('#searchForm').addEventListener('submit', e => { e.preventDefault(); loadCity($('#searchInput').value); });
  $('#surprise').addEventListener('click', () => { const n = Object.values(DEMO).map(d => d.name); loadCity(n[Math.floor(Math.random() * n.length)]); });
  /* Voice search (Web Speech API; hidden if the browser lacks it) */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition, mic = $('#mic');
  if (!SR) mic.hidden = true;
  else mic.addEventListener('click', () => {
    const r = new SR(); r.lang = 'en-IN'; mic.classList.add('on');
    r.onresult = e => { const v = e.results[0][0].transcript.replace(/[.,!?]$/, ''); $('#searchInput').value = v; loadCity(v); };
    r.onerror = () => { $('#searchMsg').textContent = 'Couldn’t hear that. Please try again.'; };
    r.onend = () => mic.classList.remove('on');
    r.start();
  });
  document.body.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'cmpInput') compareCity(e.target.value); });
  $('#back').addEventListener('click', () => showView('home'));
  document.body.addEventListener('click', e => {
    const t = e.target.closest('button,a'); if (!t) return;
    if (t.dataset.city) loadCity(t.dataset.city);
    if (t.dataset.view) { e.preventDefault(); const v = t.dataset.view;
      if (v === 'discover') { state.last ? showView('dashboard') : $('#surprise').click(); }
      else { if (v === 'favorites') renderFavorites(); showView(v); } }
    if (t.dataset.cat) { state.cat = t.dataset.cat; renderPlaces(); }
    if (t.dataset.fav) { favs.toggle(state.places[+t.dataset.fav]); renderPlaces(); }
    if (t.dataset.map) { const p = state.places[+t.dataset.map]; renderMap(p.lat, p.lon, p.name); $('#mapBox').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (t.dataset.unfav !== undefined || t.dataset.rm !== undefined) { const i = +(t.dataset.unfav ?? t.dataset.rm); const a = favs.all(); favs.toggle(a[i]); renderFavorites(); }
    if (t.id === 'cmpBtn') compareCity($('#cmpInput').value);
    if (t.id === 'planBtn') $('#plan').innerHTML = planDay(state.places, describeWeather(0).kind && state.city ? currentKind() : 'sunny').map(([k, v]) => `<div><span>${k}</span>${esc(v)}</div>`).join('');
  });
  showView('home');
}
const currentKind = () => { const m = $('.mood'); return m && m.textContent.includes('Rainy') ? 'rainy' : 'sunny'; };
document.addEventListener('DOMContentLoaded', init);
