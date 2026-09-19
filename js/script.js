const STORAGE_KEY = 'lj-memories';
const TOGETHER_DATE_KEY = 'lj-together-date';
const DATING_DATE_KEY = 'lj-dating-date';
const UNLOCKED_KEY = 'lj-unlocked';
const DEFAULT_TOGETHER_DATE = '2025-08-13'; // 13/08/2025
const DEFAULT_DATING_DATE = '2026-02-08'; // 08/02/2026 (pedido oficial)
const SITE_PASSWORD_DIGITS = '080226'; // 08/02/26, só números

const CATEGORY_LABELS = {
  momento: 'Momento especial',
  viagem: 'Viagem',
  aniversario: 'Aniversário',
  marco: 'Marco da relação',
};

const SEED_KEY = 'lj-seeded';
const SEED_V2_KEY = 'lj-seeded-v2';

const SERGIPE_MEMORIES = [
  {
    id: 'seed-sergipe-02',
    title: 'Sergipe - Quinta-feira Santa',
    date: '2026-04-02',
    category: 'viagem',
    description: 'Nossa primeira viagem juntos! Chegamos a Sergipe para viver a Semana Santa juntos.',
    photos: ['images/sergipe-6.jpg', 'images/sergipe-7.jpg', 'images/sergipe-8.jpg', 'images/sergipe-9.jpg', 'images/sergipe-10.jpg'],
  },
  {
    id: 'seed-sergipe-03',
    title: 'Sergipe - Sexta-feira Santa',
    date: '2026-04-03',
    category: 'viagem',
    description: 'Segundo dia de viagem, aproveitando cada momento em Sergipe.',
    photos: ['images/sergipe-2.jpg', 'images/sergipe-11.jpg', 'images/sergipe-12.jpg'],
  },
  {
    id: 'seed-sergipe-04',
    title: 'Sergipe - Sábado de Aleluia',
    date: '2026-04-04',
    category: 'viagem',
    description: 'Mais um dia especial da nossa primeira viagem juntos.',
    photos: ['images/sergipe-3.jpg', 'images/sergipe-4.jpg', 'images/sergipe-5.jpg'],
  },
  {
    id: 'seed-sergipe-05',
    title: 'Sergipe - Domingo de Páscoa',
    date: '2026-04-05',
    category: 'viagem',
    description: 'Encerramos nossa primeira viagem juntos no Domingo de Páscoa.',
    photos: ['images/sergipe-1.jpg'],
  },
];

const SEED_V3_KEY = 'lj-seeded-v3';
const MILESTONE_MEMORIES = [
  { id: 'seed-marco-01', title: 'Começamos a conversar', date: '2025-08-13', category: 'marco', description: '', photos: ['images/conversando-1.jpg'] },
  { id: 'seed-marco-02', title: 'Primeiro selinho', date: '2025-09-26', category: 'marco', description: '' },
  { id: 'seed-marco-03', title: 'Contei pro meu pai', date: '2025-10-26', category: 'marco', description: '', photos: ['images/pai-1.jpg', 'images/pai-2.jpg', 'images/pai-3.jpg', 'images/pai-4.jpg'] },
  { id: 'seed-marco-04', title: 'Primeiro date', date: '2025-11-30', category: 'marco', description: '', photos: ['images/date-1.jpg', 'images/date-2.jpg', 'images/date-3.jpg', 'images/date-4.jpg', 'images/date-5.jpg', 'images/date-6.jpg'] },
  { id: 'seed-marco-05', title: 'Primeiro beijo', date: '2025-12-14', category: 'marco', description: '' },
  { id: 'seed-marco-06', title: 'Primeira vez', date: '2026-01-09', category: 'marco', description: '' },
  { id: 'seed-marco-07', title: 'Pedido oficial de namoro', date: '2026-02-08', category: 'marco', description: '', photos: ['images/pedido-1.jpg'] },
];

const SEED_V4_KEY = 'lj-seeded-v4';
const EXTRA_MOMENT_MEMORIES = [
  { id: 'seed-momento-01', title: 'Noite na hamburgueria', date: '2025-12-23', category: 'momento', description: '', photos: ['images/hamburgueria-1.jpg'] },
  { id: 'seed-momento-02', title: 'Manhã preguiçosa', date: '2026-01-18', category: 'momento', description: '', photos: ['images/janeiro-1.jpg'] },
];

function seedMemories() {
  if (!localStorage.getItem(SEED_KEY)) {
    localStorage.setItem(SEED_KEY, 'true');
  }

  if (!localStorage.getItem(SEED_V2_KEY)) {
    const memories = loadMemories().filter(m => m.id !== 'seed-sergipe');
    const existingIds = new Set(memories.map(m => m.id));
    SERGIPE_MEMORIES.forEach(m => {
      if (!existingIds.has(m.id)) memories.push(m);
    });
    saveMemories(memories);
    localStorage.setItem(SEED_V2_KEY, 'true');
  }

  if (!localStorage.getItem(SEED_V3_KEY)) {
    const memories = loadMemories();
    const existingIds = new Set(memories.map(m => m.id));
    MILESTONE_MEMORIES.forEach(m => {
      if (!existingIds.has(m.id)) memories.push(m);
    });
    saveMemories(memories);
    localStorage.setItem(SEED_V3_KEY, 'true');
  }

  if (!localStorage.getItem(SEED_V4_KEY)) {
    const memories = loadMemories();

    // adiciona fotos aos marcos que ja existiam sem foto
    const byId = new Map(MILESTONE_MEMORIES.map(m => [m.id, m]));
    memories.forEach(mem => {
      const source = byId.get(mem.id);
      if (source && source.photos && !getMemoryPhotos(mem).length) {
        mem.photos = source.photos;
      }
    });

    // adiciona os novos momentos (hamburgueria e manha preguicosa)
    const existingIds = new Set(memories.map(m => m.id));
    EXTRA_MOMENT_MEMORIES.forEach(m => {
      if (!existingIds.has(m.id)) memories.push(m);
    });

    saveMemories(memories);
    localStorage.setItem(SEED_V4_KEY, 'true');
  }
}

function loadMemories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveMemories(memories) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
}

function loadTogetherDate() {
  return localStorage.getItem(TOGETHER_DATE_KEY) || DEFAULT_TOGETHER_DATE;
}

function saveTogetherDate(date) {
  localStorage.setItem(TOGETHER_DATE_KEY, date);
}

function loadDatingDate() {
  return localStorage.getItem(DATING_DATE_KEY) || DEFAULT_DATING_DATE;
}

function saveDatingDate(date) {
  localStorage.setItem(DATING_DATE_KEY, date);
}

const DATING_DATE_FIX_KEY = 'lj-dating-date-fixed-v1';
function fixWrongDatingDate() {
  if (localStorage.getItem(DATING_DATE_FIX_KEY)) return;
  if (localStorage.getItem(DATING_DATE_KEY) === '2026-08-02') {
    saveDatingDate(DEFAULT_DATING_DATE);
  }
  localStorage.setItem(DATING_DATE_FIX_KEY, 'true');
}

function formatDatePtBr(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

/* ---------- Temporizadores ao vivo "juntos há" / "namorando há" ---------- */
const liveTimerIntervals = {};

function breakdownYearsMonthsDays(startDate, now) {
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function formatBreakdown({ years, months, days }) {
  const parts = [];
  if (years > 0) parts.push(`${years} ano${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} ${months > 1 ? 'meses' : 'mês'}`);
  if (days > 0 || parts.length === 0) parts.push(`${days} dia${days !== 1 ? 's' : ''}`);

  if (parts.length === 1) return parts[0];
  return parts.slice(0, -1).join(', ') + ' e ' + parts[parts.length - 1];
}

function setupLiveTimer(containerId, dateStr) {
  const container = document.getElementById(containerId);
  const target = new Date(dateStr + 'T00:00:00');

  if (liveTimerIntervals[containerId]) clearInterval(liveTimerIntervals[containerId]);

  function tick() {
    const now = new Date();
    const diff = now.getTime() - target.getTime();

    if (diff < 0) {
      container.innerHTML = `<p class="timer-pending">essa data ainda vai chegar!</p>`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const breakdownText = formatBreakdown(breakdownYearsMonthsDays(target, now));

    container.innerHTML = `
      <div class="timer-days">
        <span class="days-num">${days}</span>
        <span class="days-lbl">dias</span>
      </div>
      <p class="timer-breakdown">${breakdownText}</p>
      <div class="timer-sub">
        <div class="unit"><span class="num">${hours}</span><span class="lbl">horas</span></div>
        <div class="unit"><span class="num">${minutes}</span><span class="lbl">min</span></div>
        <div class="unit"><span class="num">${seconds}</span><span class="lbl">seg</span></div>
      </div>
    `;
  }

  tick();
  liveTimerIntervals[containerId] = setInterval(tick, 1000);
}

function updateTogetherCounter() {
  setupLiveTimer('together-timer', loadTogetherDate());
  setupLiveTimer('dating-timer', loadDatingDate());
}

/* ---------- Countdown para próxima data futura ---------- */
let countdownInterval = null;

function updateCountdown() {
  const memories = loadMemories();
  const now = new Date();
  const future = memories
    .filter(m => new Date(m.date + 'T00:00:00') >= new Date(now.toDateString()))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const label = document.getElementById('countdown-label');
  const numbers = document.getElementById('countdown-numbers');

  if (countdownInterval) clearInterval(countdownInterval);

  if (future.length === 0) {
    label.textContent = 'nenhuma data futura cadastrada ainda — adicione uma abaixo!';
    numbers.innerHTML = '';
    return;
  }

  const next = future[0];
  label.textContent = `${next.title} — ${formatDatePtBr(next.date)}`;

  function tick() {
    const target = new Date(next.date + 'T00:00:00').getTime();
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    numbers.innerHTML = `
      <div class="unit"><span class="num">${days}</span><span class="lbl">dias</span></div>
      <div class="unit"><span class="num">${hours}</span><span class="lbl">horas</span></div>
      <div class="unit"><span class="num">${minutes}</span><span class="lbl">min</span></div>
      <div class="unit"><span class="num">${seconds}</span><span class="lbl">seg</span></div>
    `;
  }
  tick();
  countdownInterval = setInterval(tick, 1000);
}

/* ---------- Renderizar timeline ---------- */
function renderTimeline() {
  const memories = loadMemories().slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  const list = document.getElementById('timeline-list');
  const empty = document.getElementById('timeline-empty');
  list.innerHTML = '';

  if (memories.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  memories.forEach(mem => {
    const photos = getMemoryPhotos(mem);
    const videos = getMemoryVideos(mem);
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <span class="cat">${CATEGORY_LABELS[mem.category] || mem.category}</span>
      <div class="date">${formatDatePtBr(mem.date)}</div>
      <div class="title-view">
        <h3>${escapeHtml(mem.title)}</h3>
        <button class="edit-title-btn" data-id="${mem.id}">✏️</button>
      </div>
      <div class="desc-view">
        ${mem.description ? `<p>${escapeHtml(mem.description)}</p>` : ''}
        <button class="edit-desc-btn" data-id="${mem.id}">✏️ ${mem.description ? 'editar descrição' : 'adicionar descrição'}</button>
      </div>
      ${(photos.length || videos.length) ? `
        <div class="timeline-photos">
          ${photos.map(src => `<img src="${src}" alt="${escapeHtml(mem.title)}" data-lightbox>`).join('')}
          ${videos.map(src => `<video src="${src}" controls></video>`).join('')}
        </div>
      ` : ''}
    `;
    list.appendChild(item);
  });
}

function getMemoryPhotos(mem) {
  if (Array.isArray(mem.photos) && mem.photos.length) return mem.photos;
  if (mem.photo) return [mem.photo];
  return [];
}

function getMemoryVideos(mem) {
  return Array.isArray(mem.videos) ? mem.videos : [];
}

/* ---------- Galeria em álbuns (um por momento) ---------- */
let currentAlbumIndex = 0;
let albumOverlayTimeout = null;

function getAlbums() {
  return loadMemories()
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter(mem => getMemoryPhotos(mem).length || getMemoryVideos(mem).length);
}

function renderGallery(options) {
  const animate = options && options.animate;
  const albums = getAlbums();
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  const nav = document.querySelector('.album-nav');
  const position = document.getElementById('album-position');
  const overlay = document.getElementById('album-title-overlay');
  grid.innerHTML = '';

  if (albums.length === 0) {
    empty.hidden = false;
    nav.hidden = true;
    overlay.classList.remove('show');
    return;
  }
  empty.hidden = true;
  nav.hidden = false;

  if (currentAlbumIndex >= albums.length) currentAlbumIndex = albums.length - 1;
  if (currentAlbumIndex < 0) currentAlbumIndex = 0;

  const album = albums[currentAlbumIndex];
  position.textContent = `Álbum ${currentAlbumIndex + 1} de ${albums.length}`;

  getMemoryPhotos(album).forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = album.title;
    img.setAttribute('data-lightbox', '');
    grid.appendChild(img);
  });

  getMemoryVideos(album).forEach(src => {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.className = 'gallery-video';
    grid.appendChild(video);
  });

  if (animate) {
    overlay.innerHTML = `<span>${escapeHtml(album.title)}</span>`;
    overlay.classList.add('show');
    clearTimeout(albumOverlayTimeout);
    albumOverlayTimeout = setTimeout(() => overlay.classList.remove('show'), 1000);
  }
}

function setupAlbumNav() {
  const prevBtn = document.getElementById('album-prev');
  const nextBtn = document.getElementById('album-next');

  prevBtn.addEventListener('click', () => {
    const albums = getAlbums();
    if (albums.length === 0) return;
    currentAlbumIndex = (currentAlbumIndex - 1 + albums.length) % albums.length;
    renderGallery({ animate: true });
  });

  nextBtn.addEventListener('click', () => {
    const albums = getAlbums();
    if (albums.length === 0) return;
    currentAlbumIndex = (currentAlbumIndex + 1) % albums.length;
    renderGallery({ animate: true });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Lightbox ---------- */
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentGroup = [];
  let currentIndex = 0;

  function show(index) {
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    lightboxImg.src = currentGroup[currentIndex];
  }

  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-lightbox]')) {
      const container = e.target.closest('.timeline-photos, #gallery-grid');
      const groupImgs = container
        ? Array.from(container.querySelectorAll('[data-lightbox]'))
        : [e.target];
      currentGroup = groupImgs.map(img => img.src);
      show(groupImgs.indexOf(e.target));
      lightbox.hidden = false;
    }
  });

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); show(currentIndex - 1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); show(currentIndex + 1); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
    if (e.key === 'Escape') lightbox.hidden = true;
  });

  closeBtn.addEventListener('click', () => { lightbox.hidden = true; });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.hidden = true;
  });
}

/* ---------- Formulário de nova memória ---------- */
function setupMemoryForm() {
  const form = document.getElementById('memory-form');
  const photoInput = document.getElementById('mem-photo');
  const previewWrap = document.getElementById('photo-preview-wrap');
  const preview = document.getElementById('photo-preview');
  let photoDataUrl = '';

  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (!file) {
      previewWrap.hidden = true;
      photoDataUrl = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      photoDataUrl = e.target.result;
      preview.src = photoDataUrl;
      previewWrap.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('mem-title').value.trim();
    const date = document.getElementById('mem-date').value;
    const category = document.getElementById('mem-category').value;
    const description = document.getElementById('mem-desc').value.trim();

    if (!title || !date) return;

    const memories = loadMemories();
    memories.push({
      id: Date.now().toString(),
      title,
      date,
      category,
      description,
      photo: photoDataUrl,
    });
    saveMemories(memories);

    form.reset();
    previewWrap.hidden = true;
    photoDataUrl = '';

    renderTimeline();
    renderGallery();
    updateCountdown();
  });
}

/* ---------- Editar descrição de um momento ---------- */
function setupDescriptionEdit() {
  document.getElementById('timeline-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.edit-desc-btn');
    if (!btn) return;

    const id = btn.getAttribute('data-id');
    const memories = loadMemories();
    const mem = memories.find(m => m.id === id);
    if (!mem) return;

    const descView = btn.closest('.desc-view');
    descView.innerHTML = `
      <textarea class="edit-desc-textarea" rows="3">${escapeHtml(mem.description || '')}</textarea>
      <div class="edit-desc-actions">
        <button class="btn-secondary save-desc-btn" data-id="${id}">Salvar</button>
        <button class="cancel-desc-btn" data-id="${id}">Cancelar</button>
      </div>
    `;
    descView.querySelector('textarea').focus();
  });

  document.getElementById('timeline-list').addEventListener('click', (e) => {
    if (e.target.matches('.save-desc-btn')) {
      const id = e.target.getAttribute('data-id');
      const textarea = e.target.closest('.desc-view').querySelector('textarea');
      const memories = loadMemories();
      const mem = memories.find(m => m.id === id);
      if (mem) {
        mem.description = textarea.value.trim();
        saveMemories(memories);
      }
      renderTimeline();
    } else if (e.target.matches('.cancel-desc-btn')) {
      renderTimeline();
    }
  });
}

/* ---------- Editar título de um momento ---------- */
function setupTitleEdit() {
  document.getElementById('timeline-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.edit-title-btn');
    if (!btn) return;

    const id = btn.getAttribute('data-id');
    const memories = loadMemories();
    const mem = memories.find(m => m.id === id);
    if (!mem) return;

    const titleView = btn.closest('.title-view');
    titleView.innerHTML = `
      <input type="text" class="edit-title-input" value="${escapeHtml(mem.title)}">
      <button class="btn-secondary save-title-btn" data-id="${id}">Salvar</button>
      <button class="cancel-title-btn" data-id="${id}">Cancelar</button>
    `;
    const input = titleView.querySelector('.edit-title-input');
    input.focus();
    input.select();
  });

  document.getElementById('timeline-list').addEventListener('click', (e) => {
    if (e.target.matches('.save-title-btn')) {
      const id = e.target.getAttribute('data-id');
      const input = e.target.closest('.title-view').querySelector('.edit-title-input');
      const value = input.value.trim();
      const memories = loadMemories();
      const mem = memories.find(m => m.id === id);
      if (mem && value) {
        mem.title = value;
        saveMemories(memories);
      }
      renderTimeline();
      renderGallery();
    } else if (e.target.matches('.cancel-title-btn')) {
      renderTimeline();
    }
  });
}

/* ---------- Organizador em massa de fotos e vídeos ---------- */

// Leitor minimo de EXIF (DateTimeOriginal) para JPEGs, sem depender de bibliotecas externas
function parseJpegExifDate(buffer) {
  try {
    const view = new DataView(buffer);
    if (view.getUint16(0) !== 0xFFD8) return null;

    let offset = 2;
    while (offset < view.byteLength - 4) {
      const marker = view.getUint16(offset);
      if ((marker & 0xFF00) !== 0xFF00) break;
      if (marker === 0xFFD8) { offset += 2; continue; }
      if (marker === 0xFFDA) break;

      const segLength = view.getUint16(offset + 2);
      if (marker === 0xFFE1) {
        const date = parseExifApp1(view, offset + 4);
        if (date) return date;
      }
      offset += 2 + segLength;
    }
  } catch (e) {
    // arquivo mal formado, ignora
  }
  return null;
}

function parseExifApp1(view, start) {
  if (view.getUint32(start) !== 0x45786966) return null; // "Exif"
  const tiffStart = start + 6;
  const little = view.getUint16(tiffStart) === 0x4949;
  const get16 = (off) => view.getUint16(off, little);
  const get32 = (off) => view.getUint32(off, little);

  const ifd0Addr = tiffStart + get32(tiffStart + 4);
  const numEntries0 = get16(ifd0Addr);
  let exifIfdOffset = null;
  for (let i = 0; i < numEntries0; i++) {
    const entryAddr = ifd0Addr + 2 + i * 12;
    if (get16(entryAddr) === 0x8769) {
      exifIfdOffset = get32(entryAddr + 8);
      break;
    }
  }
  if (exifIfdOffset == null) return null;

  const exifIfdAddr = tiffStart + exifIfdOffset;
  const numEntriesExif = get16(exifIfdAddr);
  for (let i = 0; i < numEntriesExif; i++) {
    const entryAddr = exifIfdAddr + 2 + i * 12;
    const tag = get16(entryAddr);
    if (tag === 0x9003 || tag === 0x9004) {
      const count = get32(entryAddr + 4);
      const strOffset = count <= 4 ? entryAddr + 8 : tiffStart + get32(entryAddr + 8);
      let str = '';
      for (let j = 0; j < count - 1; j++) {
        str += String.fromCharCode(view.getUint8(strOffset + j));
      }
      const m = str.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
      if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
    }
  }
  return null;
}

function isJpegFile(file) {
  return /\.jpe?g$/i.test(file.name) || file.type === 'image/jpeg';
}

function isHeicFile(file) {
  return /\.(heic|heif)$/i.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif';
}

function readFileDate(file) {
  return new Promise((resolve) => {
    if (!isJpegFile(file)) {
      resolve(new Date(file.lastModified));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(parseJpegExifDate(e.target.result) || new Date(file.lastModified));
    reader.onerror = () => resolve(new Date(file.lastModified));
    reader.readAsArrayBuffer(file.slice(0, 131072));
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function convertHeicIfNeeded(file) {
  if (!isHeicFile(file) || typeof heic2any === 'undefined') return file;
  try {
    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
    return Array.isArray(converted) ? converted[0] : converted;
  } catch (e) {
    return file;
  }
}

function resizeImageToDataUrl(blob, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function toDateInputValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

let organizerItems = [];

function setupOrganizer() {
  const input = document.getElementById('organizer-input');
  const grid = document.getElementById('organizer-grid');
  const actions = document.getElementById('organizer-actions');
  const feedback = document.getElementById('organizer-feedback');
  const sortBtn = document.getElementById('organizer-sort-btn');
  const saveBtn = document.getElementById('organizer-save-btn');

  function renderOrganizerGrid() {
    grid.innerHTML = '';
    actions.hidden = organizerItems.length === 0;

    organizerItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'organizer-card';
      card.draggable = true;
      card.dataset.index = index;

      const media = item.isVideo
        ? `<video src="${item.url}" muted></video>`
        : isHeicFile(item.file)
          ? `<div class="organizer-heic-placeholder"><span class="icon">📷</span>HEIC</div>`
          : `<img src="${item.url}" alt="prévia">`;

      card.innerHTML = `
        ${media}
        <input type="date" value="${toDateInputValue(item.date)}">
        <button type="button" class="organizer-remove">remover</button>
      `;

      card.querySelector('input[type="date"]').addEventListener('change', (e) => {
        const [y, m, d] = e.target.value.split('-').map(Number);
        item.date = new Date(y, m - 1, d);
      });

      card.querySelector('.organizer-remove').addEventListener('click', () => {
        URL.revokeObjectURL(item.url);
        organizerItems.splice(index, 1);
        renderOrganizerGrid();
      });

      card.addEventListener('dragstart', () => card.classList.add('dragging'));
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        Array.from(grid.children).forEach(c => c.classList.remove('drag-over'));
      });
      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        card.classList.add('drag-over');
      });
      card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('drag-over');
        const draggingCard = grid.querySelector('.dragging');
        if (!draggingCard || draggingCard === card) return;
        const fromIndex = Number(draggingCard.dataset.index);
        const toIndex = Number(card.dataset.index);
        const [moved] = organizerItems.splice(fromIndex, 1);
        organizerItems.splice(toIndex, 0, moved);
        renderOrganizerGrid();
      });

      grid.appendChild(card);
    });
  }

  input.addEventListener('change', async () => {
    const files = Array.from(input.files || []);
    if (files.length === 0) return;
    feedback.hidden = true;

    for (const file of files) {
      const isVideo = file.type.startsWith('video/');
      const date = await readFileDate(file);
      organizerItems.push({
        id: 'org-' + Math.random().toString(36).slice(2),
        file,
        url: URL.createObjectURL(file),
        date,
        isVideo,
      });
    }

    organizerItems.sort((a, b) => a.date - b.date);
    renderOrganizerGrid();
    input.value = '';
  });

  sortBtn.addEventListener('click', () => {
    organizerItems.sort((a, b) => a.date - b.date);
    renderOrganizerGrid();
  });

  saveBtn.addEventListener('click', async () => {
    if (organizerItems.length === 0) return;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Organizando...';

    const memories = loadMemories();
    let skippedVideos = 0;

    const groups = new Map();
    organizerItems.forEach(item => {
      const key = toDateInputValue(item.date);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });

    for (const [dateKey, items] of groups) {
      let mem = memories.find(m => m.date === dateKey);
      if (!mem) {
        mem = {
          id: 'mem-' + Date.now().toString() + '-' + Math.random().toString(36).slice(2, 6),
          title: `Momento em ${formatDatePtBr(dateKey)}`,
          date: dateKey,
          category: 'momento',
          description: '',
          photos: [],
          videos: [],
        };
        memories.push(mem);
      }
      const existingPhotos = getMemoryPhotos(mem);
      mem.photos = Array.isArray(mem.photos) ? mem.photos : existingPhotos;
      if (!Array.isArray(mem.photos)) mem.photos = [];
      if (!Array.isArray(mem.videos)) mem.videos = [];
      delete mem.photo;

      for (const item of items) {
        if (item.isVideo) {
          if (item.file.size > 6 * 1024 * 1024) {
            skippedVideos++;
            continue;
          }
          try {
            mem.videos.push(await fileToDataUrl(item.file));
          } catch (e) {
            skippedVideos++;
          }
        } else {
          try {
            const blob = await convertHeicIfNeeded(item.file);
            mem.photos.push(await resizeImageToDataUrl(blob, 1600, 0.8));
          } catch (e) {
            try {
              mem.photos.push(await fileToDataUrl(item.file));
            } catch (e2) {
              // não deu pra ler esse arquivo, pula
            }
          }
        }
      }
    }

    try {
      saveMemories(memories);
    } catch (e) {
      feedback.hidden = false;
      feedback.textContent = 'Não deu pra salvar tudo — o navegador atingiu o limite de armazenamento. Tente adicionar menos fotos/vídeos por vez.';
      saveBtn.disabled = false;
      saveBtn.textContent = 'Organizar e guardar tudo 💾';
      return;
    }

    organizerItems.forEach(item => URL.revokeObjectURL(item.url));
    organizerItems = [];
    renderOrganizerGrid();

    feedback.hidden = false;
    feedback.textContent = skippedVideos > 0
      ? `Tudo organizado! ${skippedVideos} vídeo(s) grande(s) demais não coube(ram) e não foi(ram) salvo(s).`
      : 'Tudo organizado e guardado! 💛';

    saveBtn.disabled = false;
    saveBtn.textContent = 'Organizar e guardar tudo 💾';

    renderTimeline();
    renderGallery();
    updateCountdown();
  });
}

/* ---------- Adicionar fotos a um momento já existente ---------- */
function populateAddPhotoTarget() {
  const select = document.getElementById('add-photo-target');
  const memories = loadMemories().slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  select.innerHTML = memories
    .map(mem => `<option value="${mem.id}">${formatDatePtBr(mem.date)} — ${escapeHtml(mem.title)}</option>`)
    .join('');
}

function setupAddPhotoForm() {
  const form = document.getElementById('add-photo-form');
  const input = document.getElementById('add-photo-input');
  const previewWrap = document.getElementById('add-photo-preview-wrap');
  const feedback = document.getElementById('add-photo-feedback');
  let pendingPhotos = [];

  populateAddPhotoTarget();

  input.addEventListener('change', () => {
    pendingPhotos = [];
    previewWrap.innerHTML = '';
    previewWrap.hidden = true;
    feedback.hidden = true;

    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    let loaded = 0;
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        pendingPhotos[i] = e.target.result;
        loaded++;
        if (loaded === files.length) {
          previewWrap.hidden = false;
          previewWrap.innerHTML = pendingPhotos.map(src => `<img src="${src}" alt="pré-visualização">`).join('');
        }
      };
      reader.readAsDataURL(file);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const targetId = document.getElementById('add-photo-target').value;
    if (!targetId || pendingPhotos.length === 0) return;

    const memories = loadMemories();
    const mem = memories.find(m => m.id === targetId);
    if (!mem) return;

    const existingPhotos = getMemoryPhotos(mem);
    mem.photos = [...existingPhotos, ...pendingPhotos];
    delete mem.photo;
    saveMemories(memories);

    form.reset();
    pendingPhotos = [];
    previewWrap.hidden = true;
    previewWrap.innerHTML = '';
    feedback.hidden = false;

    renderTimeline();
    renderGallery();
  });
}

/* ---------- Formulário de datas de início ---------- */
function setupStartDateForm() {
  const form = document.getElementById('start-date-form');
  const togetherInput = document.getElementById('together-date-input');
  const datingInput = document.getElementById('dating-date-input');
  togetherInput.value = loadTogetherDate();
  datingInput.value = loadDatingDate();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveTogetherDate(togetherInput.value);
    saveDatingDate(datingInput.value);
    updateTogetherCounter();
  });
}

/* ---------- Corações flutuantes ---------- */
function setupFloatingHearts() {
  const container = document.getElementById('hearts-bg');
  const symbols = ['💛', '💕', '💗', '🤍'];
  const count = 18;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (12 + Math.random() * 14) + 's';
    heart.style.animationDelay = (Math.random() * 12) + 's';
    heart.style.fontSize = (14 + Math.random() * 16) + 'px';
    container.appendChild(heart);
  }
}

/* ---------- Tela de senha ---------- */
function normalizeDigits(str) {
  return str.replace(/\D/g, '');
}

function setupLockScreen() {
  const isUnlocked = localStorage.getItem(UNLOCKED_KEY) === 'true';
  if (isUnlocked) {
    document.body.classList.remove('locked');
    return;
  }

  const form = document.getElementById('lock-form');
  const input = document.getElementById('lock-input');
  const error = document.getElementById('lock-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const digits = normalizeDigits(input.value);

    if (digits === SITE_PASSWORD_DIGITS) {
      localStorage.setItem(UNLOCKED_KEY, 'true');
      document.body.classList.remove('locked');
      error.hidden = true;
    } else {
      error.hidden = false;
      input.value = '';
      input.focus();
    }
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  setupLockScreen();
  setupFloatingHearts();
  seedMemories();
  fixWrongDatingDate();
  updateTogetherCounter();
  updateCountdown();
  renderTimeline();
  renderGallery();
  setupAlbumNav();
  setupMemoryForm();
  setupOrganizer();
  setupAddPhotoForm();
  setupDescriptionEdit();
  setupTitleEdit();
  setupStartDateForm();
  setupLightbox();
});
