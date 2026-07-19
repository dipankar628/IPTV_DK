const SETTINGS_KEY = 'dk_iptv_settings';

const defaultSettings = {
  m3uUrl: 'https://raw.githubusercontent.com/imdhiru/bloginstall-iptv/main/bloginstall-iptv.m3u',
  epgUrl: '',
  bufferSize: 'medium'
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings };
  } catch { return { ...defaultSettings }; }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getBufferMs(size) {
  switch (size) {
    case 'small': return 5000;
    case 'large': return 30000;
    case 'medium':
    default: return 15000;
  }
}
