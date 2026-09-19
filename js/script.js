const STORAGE_KEY = 'lj-memories';
const TOGETHER_DATE_KEY = 'lj-together-date';
const DATING_DATE_KEY = 'lj-dating-date';
const UNLOCKED_KEY = 'lj-unlocked';
const DEFAULT_TOGETHER_DATE = '2025-08-13'; // 13/08/2025
const DEFAULT_DATING_DATE = '2026-08-02'; // 02/08/2026
const SITE_PASSWORD_DIGITS = '080226'; // 08/02/26, só números

const CATEGORY_LABELS = {
  momento: 'Momento especial',
  viagem: 'Viagem',
  aniversario: 'Aniversário',
  marco: 'Marco da relação',
};

const SEED_KEY = 'lj-seeded';
const DEFAULT_MEMORIES = [
  {
    id: 'seed-sergipe',
    title: 'Viagem a Sergipe',
    date: '2026-04-02',
    category: 'viagem',
    description: 'Nossa primeira viagem juntos! Fomos para Sergipe na Semana Santa.',
    photo: '',
  },
];

function seedMemories() {
  if (localStorage.getItem(SEED_KEY)) return;
  if (loadMemories().length === 0) {
    saveMemories(DEFAULT_MEMORIES);
  }
  localStorage.setItem(SEED_KEY, 'true');
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

function formatDatePtBr(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function daysBetween(dateA, dateB) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((dateB - dateA) / msPerDay);
}

/* ---------- Contadores "juntos há" / "namorando há" ---------- */
function daysCountText(prefix, dateStr) {
  const start = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const days = daysBetween(start, now);
  if (days < 0) return null;
  const years = Math.floor(days / 365);
  const remDays = days % 365;
  let text = `${prefix} há ${days} dias`;
  if (years > 0) {
    text += ` (${years} ano${years > 1 ? 's' : ''} e ${remDays} dia${remDays !== 1 ? 's' : ''})`;
  }
  return text;
}

function updateTogetherCounter() {
  const togetherEl = document.getElementById('together-counter');
  const datingEl = document.getElementById('dating-counter');

  const togetherText = daysCountText('juntos', loadTogetherDate());
  togetherEl.textContent = togetherText || 'essa data ainda vai chegar!';

  const datingText = daysCountText('namorando', loadDatingDate());
  datingEl.textContent = datingText || 'essa data ainda vai chegar!';
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
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <span class="cat">${CATEGORY_LABELS[mem.category] || mem.category}</span>
      <div class="date">${formatDatePtBr(mem.date)}</div>
      <h3>${escapeHtml(mem.title)}</h3>
      ${mem.description ? `<p>${escapeHtml(mem.description)}</p>` : ''}
      ${mem.photo ? `<img src="${mem.photo}" alt="${escapeHtml(mem.title)}" data-lightbox>` : ''}
      <button class="delete-btn" data-id="${mem.id}">remover momento</button>
    `;
    list.appendChild(item);
  });
}

/* ---------- Renderizar galeria ---------- */
function renderGallery() {
  const memories = loadMemories().filter(m => m.photo);
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  grid.innerHTML = '';

  if (memories.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  memories.forEach(mem => {
    const img = document.createElement('img');
    img.src = mem.photo;
    img.alt = mem.title;
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

  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-lightbox]')) {
      lightboxImg.src = e.target.src;
      lightbox.hidden = false;
    }
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

/* ---------- Remover memória (delegação de evento) ---------- */
function setupDeleteHandler() {
  document.getElementById('timeline-list').addEventListener('click', (e) => {
    if (e.target.matches('.delete-btn')) {
      const id = e.target.getAttribute('data-id');
      if (!confirm('Remover este momento guardado?')) return;
      const memories = loadMemories().filter(m => m.id !== id);
      saveMemories(memories);
      renderTimeline();
      renderGallery();
      updateCountdown();
    }
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
  updateTogetherCounter();
  updateCountdown();
  renderTimeline();
  renderGallery();
  setupMemoryForm();
  setupDeleteHandler();
  setupStartDateForm();
  setupLightbox();
});
