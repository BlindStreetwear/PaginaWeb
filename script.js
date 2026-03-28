const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const year = document.getElementById('year');
const revealItems = document.querySelectorAll('[data-reveal]');
const cards = Array.from(document.querySelectorAll('.product-card'));
const grid = document.getElementById('productGrid');
const shuffleBtn = document.getElementById('shuffleBtn');
const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');

year.textContent = new Date().getFullYear();

menuToggle?.addEventListener('click', () => {
  menu.classList.toggle('open');
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => menu.classList.remove('open'));
});

const revealOnScroll = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealOnScroll.observe(item));

cards.forEach((card) => {
  card.addEventListener('click', () => {
    const image = card.querySelector('img');
    const title = card.dataset.name || 'Producto BLIND';

    modalImage.src = image?.src || '';
    modalImage.alt = title;
    modalTitle.textContent = title;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

closeModal?.addEventListener('click', () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
});

modal?.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
});

shuffleBtn?.addEventListener('click', () => {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  shuffled.forEach((card) => grid.appendChild(card));
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
});
