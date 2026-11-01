import canvasImages from '../canvasImages';

// The 1050 frame URLs are seven pepper sequences of 150 frames each.
export const FRAMES_PER_SEQUENCE = 150;
export const SEQUENCES = Array.from(
  { length: Math.floor(canvasImages.length / FRAMES_PER_SEQUENCE) },
  (_, i) => ({ id: i, start: i * FRAMES_PER_SEQUENCE, count: FRAMES_PER_SEQUENCE })
);

export const frameUrl = (index) => canvasImages[index];

// One shared cache and a small concurrency-limited queue so that nine canvases
// asking for the same frames never download a frame twice, and never open
// hundreds of requests at once.
const MAX_CONCURRENT = 8;
const cache = new Map();
const queue = [];
let inFlight = 0;

function entryFor(index) {
  const url = canvasImages[index];
  if (!url) return null;
  let entry = cache.get(url);
  if (!entry) {
    entry = { url, status: 'idle', img: null, listeners: new Set() };
    cache.set(url, entry);
  }
  return entry;
}

function pump() {
  while (inFlight < MAX_CONCURRENT && queue.length) {
    const entry = queue.shift();
    if (entry.status !== 'queued') continue;
    inFlight += 1;
    entry.status = 'loading';
    const img = new Image();
    img.decoding = 'async';
    const settle = (status) => {
      inFlight -= 1;
      entry.status = status;
      if (status === 'ready') entry.img = img;
      entry.listeners.forEach((fn) => fn(entry));
      entry.listeners.clear();
      pump();
    };
    img.onload = () => settle('ready');
    img.onerror = () => settle('error');
    img.src = entry.url;
  }
}

export function requestFrame(index, { priority = false, onSettle } = {}) {
  const entry = entryFor(index);
  if (!entry) return null;
  if (onSettle) {
    if (entry.status === 'ready' || entry.status === 'error') onSettle(entry);
    else entry.listeners.add(onSettle);
  }
  if (entry.status === 'idle') {
    entry.status = 'queued';
    if (priority) queue.unshift(entry);
    else queue.push(entry);
    pump();
  } else if (priority && entry.status === 'queued') {
    const at = queue.indexOf(entry);
    if (at > 0) {
      queue.splice(at, 1);
      queue.unshift(entry);
    }
  }
  return entry;
}

// Queue a whole sequence: the first frame jumps the queue so something
// appears immediately, the rest stream in order.
export function requestSequence(start, count, step = 1, onFirst) {
  requestFrame(start, { priority: true, onSettle: onFirst });
  for (let i = step; i < count; i += step) requestFrame(start + i);
}

export function readyFrame(index) {
  const entry = cache.get(canvasImages[index]);
  return entry && entry.status === 'ready' ? entry.img : null;
}
