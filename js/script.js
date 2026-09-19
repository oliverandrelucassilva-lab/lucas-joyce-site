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
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <span class="cat">${CATEGORY_LABELS[mem.category] || mem.category}</span>
      <div class="date">${formatDatePtBr(mem.date)}</div>
      <h3>${escapeHtml(mem.title)}</h3>
      <div class="desc-view">
        ${mem.description ? `<p>${escapeHtml(mem.description)}</p>` : ''}
        <button class="edit-desc-btn" data-id="${mem.id}">✏️ ${mem.description ? 'editar descrição' : 'adicionar descrição'}</button>
      </div>
      ${photos.length ? `
        <div class="timeline-photos">
          ${photos.map(src => `<img src="${src}" alt="${escapeHtml(mem.title)}" data-lightbox>`).join('')}
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

/* ---------- Renderizar galeria ---------- */
function renderGallery() {
  const memories = loadMemories();
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  grid.innerHTML = '';

  const allPhotos = memories.flatMap(mem =>
    getMemoryPhotos(mem).map(src => ({ src, title: mem.title }))
  );

  if (allPhotos.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  allPhotos.forEach(({ src, title }) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = title;
    img.setAttribute('data-lightbox', '');
    grid.appendChild(img);
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
  setupMemoryForm();
  setupAddPhotoForm();
  setupDescriptionEdit();
  setupStartDateForm();
  setupLightbox();
});
