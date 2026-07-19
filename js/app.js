/* ─── State ─── */
let channels = [];
let categories = [];
let activeCategory = null;
let activeTab = 'categories';
let activeIndiaSub = null;
let indiaSubCategories = {};
let favorites = new Set();
let hdOnly = false;
const FAVORITES_KEY = 'dk_iptv_favorites';

/* ─── Hardcoded Assamese channels (always included) ─── */
const ASSAMESE_CHANNELS = [
  {id:'AssamTalks.in@SD',name:'Assam Talks (576p)',logoUrl:'https://dtil.tmsimg.com/assets/s142683_ld_h15_aa.png?lock=720x540',streamUrl:'https://trs1.aynaott.com/AssamTalks/index.m3u8',category:'News',language:'as',epgId:'AssamTalks.in@SD',resolution:''},
  {id:'DDAssam.in@SD',name:'DD Assam (576p)',logoUrl:'https://dtil.tmsimg.com/assets/s142777_ld_h15_aa.png?lock=720x540',streamUrl:'https://mumt05.tangotv.in/DDASSAM/index.m3u8',category:'General',language:'as',epgId:'DDAssam.in@SD',resolution:''},
  {id:'DY365.in@SD',name:'DY 365 (576p)',logoUrl:'https://dtil.tmsimg.com/assets/s143015_ld_h15_aa.png?lock=720x540',streamUrl:'https://mumt04.tangotv.in/DY365/index.m3u8',category:'News',language:'as',epgId:'DY365.in@SD',resolution:''},
  {id:'Jonack.in@SD',name:'Jonack (576p)',logoUrl:'https://xstreamcp-assets-msp.streamready.in/assets/LIVETV/LIVECHANNEL/LIVETV_LIVETVCHANNEL_JONACK/images/LOGO_HD/image.png',streamUrl:'https://cdn-6.pishow.tv/live/10006/master.m3u8',category:'General',language:'as',epgId:'Jonack.in@SD',resolution:''},
  {id:'News18AssamNorthEast.in@SD',name:'News18 Assam North-East (1080p)',logoUrl:'https://xstreamcp-assets-msp.streamready.in/assets/LIVETV/LIVECHANNEL/LIVETV_LIVETVCHANNEL_NEWS18_ASSAM_NORTHSYMHYPEAST/images/LOGO_HD/image.png',streamUrl:'https://n18syndication.akamaized.net/bpk-tv/News18_Assam_North_East_NW18_MOB/output01/master.m3u8',category:'News',language:'as',epgId:'News18AssamNorthEast.in@SD',resolution:'1080p'},
  {id:'NewsLive.in@SD',name:'News Live (576p)',logoUrl:'https://xstreamcp-assets-msp.streamready.in/assets/LIVETV/LIVECHANNEL/LIVETV_LIVETVCHANNEL_NEWS_LIVE/images/LOGO_HD/image.png',streamUrl:'https://cdn-6.pishow.tv/live/10011/master.m3u8',category:'News',language:'as',epgId:'NewsLive.in@SD',resolution:''},
  {id:'NKTV24x7.in@SD',name:'NK TV 24x7 (1080p)',logoUrl:'https://xstreamcp-assets-msp.streamready.in/assets/LIVETV/LIVECHANNEL/LIVETV_LIVETVCHANNEL_NK_TV_PLUS/images/LOGO_HD/image.png',streamUrl:'https://nktv.smartstream.video/smartstream-us/nktvplus/nktvplus/chunks.m3u8',category:'News',language:'as',epgId:'NKTV24x7.in@SD',resolution:'1080p'},
  {id:'PragNews.in@SD',name:'Prag News (576p)',logoUrl:'https://dtil.tmsimg.com/assets/s143671_ld_h15_aa.png?lock=720x540',streamUrl:'https://mumt05.tangotv.in/PRAGNEWS/index.m3u8',category:'News',language:'as',epgId:'PragNews.in@SD',resolution:''},
  {id:'PrathamKhabar24x7.in@SD',name:'Pratham Khabar 24x7 (1080p)',logoUrl:'https://i.imgur.com/HNsg5Px.png',streamUrl:'https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/pratham-khabar-24x7/index.m3u8',category:'News',language:'as',epgId:'PrathamKhabar24x7.in@SD',resolution:'1080p'},
  {id:'PratidinTime.in@SD',name:'Pratidin Time (576p)',logoUrl:'https://xstreamcp-assets-msp.streamready.in/assets/LIVETV/LIVECHANNEL/LIVETV_LIVETVCHANNEL_PRATIDIN_TIME/images/LOGO_HD/image.png',streamUrl:'https://server.thelegitpro.in/pratidintime/pratidintime/index.fmp4.m3u8',category:'News',language:'as',epgId:'PratidinTime.in@SD',resolution:''},
  {id:'Ramdhenu.in@SD',name:'Ramdhenu (576p)',logoUrl:'https://dtil.tmsimg.com/assets/s143717_ld_h15_aa.png?lock=720x540',streamUrl:'https://cdn-7.pishow.tv/live/10016/master.m3u8',category:'Undefined',language:'as',epgId:'Ramdhenu.in@SD',resolution:''},
  {id:'Rang.in@SD',name:'Rang (576p)',logoUrl:'https://xstreamcp-assets-msp.streamready.in/assets/LIVETV/LIVECHANNEL/LIVETV_LIVETVCHANNEL_RANG/images/LOGO_HD/image.png',streamUrl:'https://cdn-7.pishow.tv/live/10017/master.m3u8',category:'Undefined',language:'as',epgId:'Rang.in@SD',resolution:''},
  {id:'Rengoni.in@SD',name:'Rengoni (396p)',logoUrl:'https://dtil.tmsimg.com/assets/s143722_ld_h15_aa.png?lock=720x540',streamUrl:'https://d1msejlow1t3l4.cloudfront.net/fta/rengonitv/playlist.m3u8',category:'Undefined',language:'as',epgId:'Rengoni.in@SD',resolution:''},
  {id:'Spondon.in@SD',name:'Spondon (1080p)',logoUrl:'https://www.spondontv.com/wp-content/uploads/2025/10/cropped-SPONDON_Blue-Violet_1-copy-300x100.png',streamUrl:'https://nktv.smartstream.video/smartstream-us/spondon/spondon/playlist.m3u8',category:'Entertainment',language:'as',epgId:'Spondon.in@SD',resolution:'1080p'},
  {id:'PearTV.in@SD',name:'Pear TV (576p)',logoUrl:'https://xstreamcp-assets-msp.streamready.in/assets/LIVETV/LIVECHANNEL/LIVETV_LIVETVCHANNEL_PEARS_TV/images/LOGO_HD/image.png',streamUrl:'https://mumt01.tangotv.in/O5aw8Zn3PEARTV/index.m3u8',category:'Entertainment',language:'as',epgId:'PearTV.in@SD',resolution:''}
];

/* ─── DOM refs ─── */
const categoryList = document.getElementById('category-list');
const channelGrid = document.getElementById('channel-grid-inner');
const browseView = document.getElementById('browse-view');
const playerView = document.getElementById('player-view');
const settingsModal = document.getElementById('settings-modal');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');

const searchInput = document.getElementById('search-input');
const searchSuggestions = document.getElementById('search-suggestions');
const btnHd = document.getElementById('btn-hd');
const btnSettings = document.getElementById('btn-settings');
const btnRefresh = document.getElementById('btn-refresh');
const btnBack = document.getElementById('btn-back');
const btnSaveSettings = document.getElementById('btn-save-settings');
const btnCloseSettings = document.getElementById('btn-close-settings');

const inpM3u = document.getElementById('setting-m3u-url');
const inpEpg = document.getElementById('setting-epg-url');
const selBuffer = document.getElementById('setting-buffer');

const tabs = document.querySelectorAll('#tab-bar .tab');

/* ─── M3U Parser ─── */
function parseM3u(content) {
  const result = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('#EXTINF:')) continue;
    const attrs = parseExtInf(line);
    i++;
    while (i < lines.length && lines[i].trim().startsWith('#')) i++;
    if (i < lines.length && lines[i].trim()) {
      const url = lines[i].trim();
      if (!url.startsWith('#')) {
        result.push({
          id: attrs['tvg-id'] || `ch-${result.length}`,
          name: attrs['name'] || 'Unknown',
          logoUrl: attrs['tvg-logo'] || null,
          streamUrl: url,
          category: attrs['group-title'] || 'Uncategorized',
          language: attrs['tvg-language'] || '',
          epgId: attrs['tvg-id'] || null,
          resolution: parseResolution(attrs['name'] || '')
        });
      }
    }
  }
  return result;
}

function parseExtInf(line) {
  const result = {};
  const regex = /([\w-]+)="([^"]*)"/g;
  let match, lastEnd = 0;
  while ((match = regex.exec(line)) !== null) {
    result[match[1]] = match[2];
    lastEnd = match.index + match[0].length;
  }
  const commaIdx = line.indexOf(',', lastEnd);
  if (commaIdx >= 0) {
    result['name'] = line.substring(commaIdx + 1).trim();
  }
  return result;
}

function parseResolution(name) {
  const m = name.match(/\((\d{3,4})p\)/);
  return m ? m[1] + 'p' : null;
}

/* ─── India channel detection ─── */
const INDIAN_LANGS = ['hi','ta','te','ml','kn','bn','mr','gu','pa','ur','or','sa','bh','sd','ks','as','mni','ne'];
const INDIAN_KEYWORDS = [
  'star ','zee ','colors ','sun tv','sun music','sun news',
  'dd national','dd news','dd sports','dd bharati',
  'ndtv','aaj tak','india tv','republic tv','times now','news18',
  'cnbc awaaz','et now','sony ','&tv','&flix',
  'mtv india','vh1 india','nick ','sonic','discovery india',
  'national geographic india','history tv18','hbo india',
  'disney+ hotstar','jio','viacom18','voot'
];

function isIndianChannel(ch) {
  if (ch.epgId && ch.epgId.includes('.in')) return true;
  if (INDIAN_LANGS.includes(ch.language?.toLowerCase())) return true;
  const name = ch.name?.toLowerCase() || '';
  if (INDIAN_KEYWORDS.some(kw => name.includes(kw))) return true;
  const cat = (ch.category || '').toLowerCase();
  const INDIAN_CATS = ['sports','ipl','music','news','movies','kids','entertainment','sonyliv','india','religious','devotional'];
  if (INDIAN_CATS.includes(cat)) return true;
  const NON_INDIAN_CATS = ['france','usa','uk','australia','canada','germany','europe'];
  if (NON_INDIAN_CATS.some(c => cat.includes(c))) return false;
  return true;
}

function isAssameseChannel(ch) {
  if (ch.language === 'as') return true;
  const name = ch.name?.toLowerCase() || '';
  const asmKw = ['assam','asomiya','dy 365','news live','prag news','pratidin','nk tv','nktv',
    'rang','rengoni','ramdhenu','spondon','jonack','pear tv','pratham khabar','north east live',
    'news18 assam','assam talks'];
  if (asmKw.some(k => name.includes(k))) return true;
  const asmIds = ASSAMESE_CHANNELS.map(c => c.id);
  if (asmIds.includes(ch.id) || asmIds.includes(ch.epgId)) return true;
  return false;
}

function addAssameseCategory() {
  const hasAsm = channels.some(isAssameseChannel);
  if (hasAsm && !categories.includes('Assamese')) {
    const idx = categories.indexOf('India');
    categories.splice(idx >= 0 ? idx : 0, 0, 'Assamese');
  }
}

const INDIA_SUB_CATS = ['Movies', 'Kids', 'News', 'Music', 'Sports', 'Entertainment'];

function getIndiaSubCategory(ch) {
  const cat = (ch.category || '').toLowerCase();
  const name = (ch.name || '').toLowerCase();
  // Movies
  if (cat.includes('movie') || cat.includes('film') || cat.includes('cinema')
      || name.includes('movie') || name.includes('film') || name.includes('cinema')
      || name.includes('max') || name.includes('pix')) return 'Movies';
  // Kids
  if (cat.includes('kid') || cat.includes('child') || cat.includes('cartoon') || cat.includes('animation')
      || name.includes('nick') || name.includes('sonic') || name.includes('yay')
      || name.includes('pogo') || name.includes('hungama')) return 'Kids';
  // News
  if (cat.includes('news') || name.includes('news') || name.includes('aaj tak')
      || name.includes('ndtv') || name.includes('times now') || name.includes('republic')
      || name.includes('bharat') || name.includes('abp')) return 'News';
  // Music
  if (cat.includes('music') || name.includes('music') || name.includes('9xm')
      || name.includes('b4u music') || name.includes('mtv') || name.includes('beats')
      || name.includes('dhol') || name.includes('masti') || name.includes('haryanvi')) return 'Music';
  // Sports
  if (cat.includes('sport') || cat.includes('ipl') || cat.includes('cricket')
      || name.includes('sport') || name.includes('cricket') || name.includes('ten ')
      || name.includes('bein') || name.includes('super cricket') || name.includes('skye cricket')
      || name.includes('tnt')) return 'Sports';
  return 'Entertainment';
}

function buildIndiaSubCategories() {
  const indiaChs = channels.filter(isIndianChannel);
  indiaSubCategories = {};
  indiaChs.forEach(ch => {
    const sub = getIndiaSubCategory(ch);
    if (!indiaSubCategories[sub]) indiaSubCategories[sub] = [];
    indiaSubCategories[sub].push(ch);
  });
  INDIA_SUB_CATS.forEach(s => { if (!indiaSubCategories[s]) indiaSubCategories[s] = []; });
}

function addIndiaCategory() {
  if (!categories.includes('India')) {
    categories.unshift('India');
  }
  buildIndiaSubCategories();
}

/* ─── Favorites ─── */
function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) favorites = new Set(JSON.parse(raw));
  } catch { favorites = new Set(); }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

function toggleFavorite(channelId, event) {
  event.stopPropagation();
  const isFav = !favorites.has(channelId);
  if (isFav) { favorites.add(channelId); } else { favorites.delete(channelId); }
  saveFavorites();
  document.querySelectorAll(`.channel-card[data-channel-id="${channelId}"] .fav-btn`)
    .forEach(btn => {
      btn.classList.toggle('active', isFav);
      btn.innerHTML = isFav ? '♥' : '♡';
      btn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
    });
}

function addFavoritesCategory() {
  const idx = categories.indexOf('Favorites');
  if (idx >= 0) categories.splice(idx, 1);
  categories.unshift('Favorites');
}

/* ─── Fetch & Load ─── */
async function loadChannels(m3uUrl) {
  loadingText.textContent = 'Loading channels...';
  loadingOverlay.classList.remove('hidden');
  try {
    const res = await fetch(m3uUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    channels = parseM3u(text);
    localStorage.setItem('dk_iptv_channels', JSON.stringify(channels));
    buildCategories();
    switchTab(activeTab);
    loadingOverlay.classList.add('hidden');
    return true;
  } catch (e) {
    loadingText.textContent = 'Failed to load channels. Check URL and try again.';
    setTimeout(() => loadingOverlay.classList.add('hidden'), 2000);
    const cached = localStorage.getItem('dk_iptv_channels');
    if (cached) {
      channels = JSON.parse(cached);
      buildCategories();
      switchTab(activeTab);
    }
    return false;
  }
}

function buildCategories() {
  categories = [];
  addFavoritesCategory();
  addAssameseCategory();
  addIndiaCategory();
  if (categories.length && !activeCategory) activeCategory = categories[0];
}

function getLanguageDisplay(code) {
  const map = {
    hi:'Hindi', ta:'Tamil', te:'Telugu', ml:'Malayalam', kn:'Kannada',
    bn:'Bengali', mr:'Marathi', gu:'Gujarati', pa:'Punjabi', ur:'Urdu',
    or:'Odia', en:'English'
  };
  return map[code?.toLowerCase()] || code || '';
}

/* ─── Tab Switching ─── */
tabs.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  tab.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') switchTab(tab.dataset.tab);
  });
});

function switchTab(tabId) {
  activeTab = tabId;
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  const isCategories = tabId === 'categories';
  browseView.classList.toggle('sidebar-hidden', !isCategories);
  if (isCategories) {
    renderCategories();
    renderChannels();
  } else {
    renderFlatChannels();
  }
}

/* ─── Render: Categories ─── */
function renderCategories() {
  categoryList.innerHTML = '';
  categories.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat;
    li.tabIndex = 0;
    li.classList.toggle('active', cat === activeCategory);
    li.addEventListener('click', () => selectCategory(cat));
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectCategory(cat); });
    categoryList.appendChild(li);
  });
  if (categoryList.firstChild) setTimeout(() => categoryList.firstChild.focus(), 100);
}

function selectCategory(cat) {
  activeCategory = cat;
  activeIndiaSub = null;
  document.querySelectorAll('#category-list li').forEach(li =>
    li.classList.toggle('active', li.textContent === cat));
  renderChannels();
  const first = channelGrid.querySelector('.channel-card');
  if (first) setTimeout(() => first.focus(), 50);
}

/* ─── India sub-category bar ─── */
function renderIndiaSubBar() {
  const bar = document.getElementById('india-sub-bar') || (() => {
    const b = document.createElement('div');
    b.id = 'india-sub-bar';
    b.style.cssText = 'display:flex;gap:8px;padding:8px 0 12px;flex-wrap:wrap';
    channelGrid.parentNode.insertBefore(b, channelGrid);
    return b;
  })();
  bar.innerHTML = '';
  INDIA_SUB_CATS.forEach(sub => {
    const count = (indiaSubCategories[sub] || []).length;
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.textContent = `${sub} (${count})`;
    btn.dataset.sub = sub;
    btn.classList.toggle('active', sub === activeIndiaSub);
    btn.tabIndex = 0;
    btn.addEventListener('click', () => selectIndiaSub(sub));
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectIndiaSub(sub); });
    bar.appendChild(btn);
  });
  bar.style.display = 'flex';
}

function removeIndiaSubBar() {
  const bar = document.getElementById('india-sub-bar');
  if (bar) bar.style.display = 'none';
}

function selectIndiaSub(sub) {
  activeIndiaSub = sub;
  renderIndiaSubBar();
  renderChannels();
}

function renderChannels() {
  channelGrid.innerHTML = '';
  if (channels.length === 0) return showEmptyState();
  let filtered;
  if (activeCategory === 'Favorites') {
    removeIndiaSubBar();
    filtered = channels.filter(c => favorites.has(c.id));
    if (filtered.length === 0) {
      channelGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim)">No favorite channels yet. Click the ♡ on any channel to add it.</div>';
      return;
    }
  } else if (activeCategory === 'Assamese') {
    removeIndiaSubBar();
    filtered = channels.filter(isAssameseChannel);
  } else if (activeCategory === 'India') {
    if (activeIndiaSub) {
      filtered = indiaSubCategories[activeIndiaSub] || [];
    } else {
      activeIndiaSub = 'Entertainment';
      filtered = indiaSubCategories['Entertainment'] || [];
    }
    renderIndiaSubBar();
  } else {
    removeIndiaSubBar();
    filtered = activeCategory ? channels.filter(c => c.category === activeCategory) : channels;
  }
  if (hdOnly) {
    filtered = filtered.filter(ch => ch.resolution && parseInt(ch.resolution) >= 720);
  }
  if (filtered.length === 0) {
    channelGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim)">No channels in this category</div>';
    return;
  }
  filtered.forEach(ch => addChannelCard(ch));
}

function renderFlatChannels() {
  removeIndiaSubBar();
  channelGrid.innerHTML = '';
  if (channels.length === 0) return showEmptyState();
  let list = channels;
  if (hdOnly) {
    list = channels.filter(ch => ch.resolution && parseInt(ch.resolution) >= 720);
  }
  list.forEach(ch => addChannelCard(ch));
}

function addChannelCard(ch) {
  const card = document.createElement('div');
  card.className = 'channel-card';
  card.tabIndex = 0;
  card.dataset.channelId = ch.id;

  const favBtn = document.createElement('button');
  favBtn.className = 'fav-btn' + (favorites.has(ch.id) ? ' active' : '');
  favBtn.innerHTML = favorites.has(ch.id) ? '♥' : '♡';
  favBtn.setAttribute('aria-label', favorites.has(ch.id) ? 'Remove from favorites' : 'Add to favorites');
  favBtn.addEventListener('click', e => toggleFavorite(ch.id, e));

  const logo = document.createElement('img');
  logo.className = 'logo';
  logo.src = ch.logoUrl || '';
  logo.alt = '';
  logo.loading = 'lazy';
  logo.onerror = () => { logo.style.display = 'none'; };

  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = ch.name;

  const lang = document.createElement('div');
  lang.className = 'lang';
  lang.textContent = getLanguageDisplay(ch.language);

  const badge = document.createElement('span');
  badge.className = 'res-badge';
  badge.textContent = ch.resolution || '';

  card.appendChild(favBtn);
  card.appendChild(logo);
  card.appendChild(name);
  card.appendChild(lang);
  if (ch.resolution) card.appendChild(badge);

  card.addEventListener('click', () => openPlayer(ch));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPlayer(ch); }
  });
  channelGrid.appendChild(card);
}

function showEmptyState() {
  removeIndiaSubBar();
  channelGrid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-secondary)">
      <div style="font-size:48px;margin-bottom:16px;">&#128250;</div>
      <h2 style="font-size:20px;margin-bottom:8px;color:var(--text)">No Channels Loaded</h2>
      <p style="font-size:14px;line-height:1.6">Go to <strong>Settings</strong> (gear icon) to add an M3U URL.</p>
      <button class="btn primary" style="margin-top:20px;font-size:18px;padding:12px 32px"
        onclick="openSettings()">Open Settings</button>
    </div>`;
}

/* ─── Player ─── */
function openPlayer(channel) {
  playChannel(channel.streamUrl, channel.name, channel.epgId || channel.id);
}

function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  const header = document.getElementById('header');
  const searchBar = document.getElementById('search-bar');
  const tabBar = document.getElementById('tab-bar');
  if (viewId === 'player-view') {
    header.classList.add('hidden');
    searchBar.classList.add('hidden');
    tabBar.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
    searchBar.classList.remove('hidden');
    tabBar.classList.remove('hidden');
  }
}

/* ─── Settings ─── */
function openSettings() {
  const s = loadSettings();
  inpM3u.value = s.m3uUrl;
  inpEpg.value = s.epgUrl;
  selBuffer.value = s.bufferSize;
  settingsModal.classList.remove('hidden');
  inpM3u.focus();
}

function closeSettings() { settingsModal.classList.add('hidden'); }

function saveSettingsHandler() {
  saveSettings({
    m3uUrl: inpM3u.value.trim(),
    epgUrl: inpEpg.value.trim(),
    bufferSize: selBuffer.value
  });
  closeSettings();
  const cached = localStorage.getItem('dk_iptv_channels');
  if (cached) {
    channels = JSON.parse(cached);
    buildCategories();
    switchTab(activeTab);
  }
}

/* ─── Keyboard ─── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!settingsModal.classList.contains('hidden')) { closeSettings(); return; }
    if (playerView.classList.contains('active')) { exitPlayer(); return; }
  }
  if ((e.key === 'Backspace' || e.key === 'MediaTrackPrevious') && playerView.classList.contains('active')) {
    exitPlayer();
  }
});

function exitPlayer() {
  stopPlayer();
  showView('browse-view');
}

/* ─── Search ─── */
let searchTimeout = null;

function setupSearch() {
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const q = searchInput.value.trim().toLowerCase();
    if (q.length < 2) { searchSuggestions.classList.add('hidden'); return; }
    searchTimeout = setTimeout(() => {
      const matches = channels.filter(ch =>
        ch.name.toLowerCase().includes(q) ||
        (ch.language && ch.language.toLowerCase().includes(q)) ||
        (ch.category && ch.category.toLowerCase().includes(q))
      ).slice(0, 10);
      if (matches.length === 0) { searchSuggestions.classList.add('hidden'); return; }
      searchSuggestions.innerHTML = matches.map(ch =>
        `<div class="suggestion-item" data-id="${ch.id}">
          ${ch.name} <span class="suggestion-cat">${ch.category}</span>
        </div>`
      ).join('');
      searchSuggestions.classList.remove('hidden');
    }, 200);
  });

  searchSuggestions.addEventListener('click', e => {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    const ch = channels.find(c => c.id === item.dataset.id);
    if (ch) { openPlayer(ch); searchSuggestions.classList.add('hidden'); searchInput.value = ''; }
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') { searchSuggestions.classList.add('hidden'); searchInput.blur(); }
    if (e.key === 'Enter') {
      const first = searchSuggestions.querySelector('.suggestion-item');
      if (first) { first.click(); }
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#search-bar')) searchSuggestions.classList.add('hidden');
  });
}

/* ─── Init ─── */
async function init() {
  loadFavorites();
  const cached = localStorage.getItem('dk_iptv_channels');
  if (cached) {
    channels = JSON.parse(cached);
    buildCategories();
    switchTab(activeTab);
  } else {
    renderCategories();
    showEmptyState();
  }

  const epgCached = localStorage.getItem('dk_iptv_epg');
  if (epgCached) {
    try { epgCache = JSON.parse(epgCached); } catch {}
  }

  const settings = loadSettings();
  if (channels.length === 0 && settings.m3uUrl) {
    loadChannels(settings.m3uUrl);
  } else if (channels.length === 0) {
    setTimeout(() => openSettings(), 500);
  }
  if (settings.epgUrl) fetchEpg(settings.epgUrl);

  setupSearch();
  btnHd.addEventListener('click', () => {
    hdOnly = !hdOnly;
    btnHd.classList.toggle('active', hdOnly);
    if (activeTab === 'categories') renderChannels(); else renderFlatChannels();
  });
  btnSettings.addEventListener('click', openSettings);
  btnRefresh.addEventListener('click', () => {
    const s = loadSettings();
    loadChannels(s.m3uUrl);
    if (s.epgUrl) fetchEpg(s.epgUrl);
  });
  btnBack.addEventListener('click', exitPlayer);
  btnSaveSettings.addEventListener('click', saveSettingsHandler);
  btnCloseSettings.addEventListener('click', closeSettings);
}

document.addEventListener('DOMContentLoaded', init);
