let hls = null;
const video = document.getElementById('video-player');
const bufferingEl = document.getElementById('buffering-indicator');

function playChannel(streamUrl, channelName, channelId) {
  document.getElementById('epg-channel-name').textContent = channelName;
  updateEpgOverlay(channelId);

  if (hls) { hls.destroy(); hls = null; }
  video.removeAttribute('src');
  video.load();
  bufferingEl.classList.remove('hidden');

  if (streamUrl.includes('.m3u8') && Hls.isSupported()) {
    const bs = loadSettings().bufferSize;
    const bufferMs = getBufferMs(bs);
    const bufferSec = Math.round(bufferMs / 1000);
    hls = new Hls({
      maxBufferLength: bufferSec,
      maxMaxBufferLength: bufferSec * 3,
      liveSyncDuration: Math.max(bufferSec - 2, 3),
      liveMaxLatencyDuration: bufferSec * 2,
      lowLatencyMode: false,
      backbufferLength: bufferSec
    });
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      bufferingEl.classList.add('hidden');
      video.play().catch(() => {});
    });
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        }
      }
    });
  } else {
    video.src = streamUrl;
    video.play().catch(() => {});
    bufferingEl.classList.add('hidden');
  }

  showView('player-view');
  video.focus();
}

function stopPlayer() {
  if (hls) { hls.destroy(); hls = null; }
  video.removeAttribute('src');
  video.load();
  bufferingEl.classList.add('hidden');
}

function updateEpgOverlay(channelId) {
  const current = getCurrentProgram(channelId);
  const next = getNextProgram(channelId);
  document.getElementById('epg-current-title').textContent = current ? current.title : 'No program info';
  document.getElementById('epg-current-time').textContent = current ? formatEpgTime(current.startTime) + ' — ' + formatEpgTime(current.endTime) : '';
  document.getElementById('epg-next-title').textContent = next ? next.title : '';
  document.getElementById('epg-next-time').textContent = next ? formatEpgTime(next.startTime) : '';
}
