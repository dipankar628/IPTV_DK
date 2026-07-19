let epgCache = {};

async function fetchEpg(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const xml = await res.text();
    epgCache = parseXmltv(xml);
    localStorage.setItem('dk_iptv_epg', JSON.stringify(epgCache));
  } catch { /* silent */ }
}

function parseXmltv(xml) {
  const map = {};
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const programmes = doc.querySelectorAll('programme');
  programmes.forEach(p => {
    const ch = p.getAttribute('channel');
    if (!ch) return;
    const start = parseXmltvTime(p.getAttribute('start'));
    const stop = parseXmltvTime(p.getAttribute('stop'));
    const title = p.querySelector('title')?.textContent || 'Unknown';
    const desc = p.querySelector('desc, description')?.textContent || '';
    if (!map[ch]) map[ch] = [];
    map[ch].push({ title, description: desc, startTime: start, endTime: stop });
  });
  for (const ch in map) {
    map[ch].sort((a, b) => a.startTime - b.startTime);
  }
  return map;
}

function parseXmltvTime(t) {
  if (!t) return 0;
  const cleaned = t.split(' ')[0].split('+')[0].split('-')[0];
  if (cleaned.length < 14) return 0;
  const yr = cleaned.slice(0,4), mo = cleaned.slice(4,6)-1,
       dy = cleaned.slice(6,8), hr = cleaned.slice(8,10),
       mi = cleaned.slice(10,12), sc = cleaned.slice(12,14);
  return Date.UTC(yr, mo, dy, hr, mi, sc);
}

function getEpgForChannel(channelId) {
  return epgCache[channelId] || [];
}

function getCurrentProgram(channelId) {
  const now = Date.now();
  const progs = epgCache[channelId];
  if (!progs) return null;
  return progs.find(p => p.startTime <= now && p.endTime > now) || null;
}

function getNextProgram(channelId) {
  const now = Date.now();
  const progs = epgCache[channelId];
  if (!progs) return null;
  return progs.filter(p => p.startTime > now).sort((a, b) => a.startTime - b.startTime)[0] || null;
}

function formatEpgTime(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
