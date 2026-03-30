const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const year = document.getElementById('year');
const revealItems = document.querySelectorAll('[data-reveal]');
const grid = document.getElementById('productGrid');
const shuffleBtn = document.getElementById('shuffleBtn');
const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const fallbackCards = Array.from(document.querySelectorAll('.product-card'));
let cards = [...fallbackCards];

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

const attachCardHandler = (card) => {
  card.addEventListener('click', () => {
    const image = card.querySelector('img');
    const title = card.dataset.name || 'Producto BLIND';

    modalImage.src = image?.src || '';
    modalImage.alt = title;
    modalTitle.textContent = title;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
};

const bindCards = () => {
  cards.forEach((card) => attachCardHandler(card));
};

const createInstagramCard = (post) => {
  const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
  if (!imageUrl) return null;

  const caption = (post.caption || 'Publicación BLIND').split('\n')[0].trim();
  const name = caption || 'Publicación BLIND';

  const article = document.createElement('article');
  article.className = 'product-card';
  article.dataset.name = name;

  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = name;
  image.loading = 'lazy';

  const info = document.createElement('div');
  info.className = 'product-info';

  const title = document.createElement('h3');
  title.textContent = name;

  info.appendChild(title);
  article.appendChild(image);
  article.appendChild(info);

  if (post.permalink) {
    article.addEventListener('dblclick', () => {
      window.open(post.permalink, '_blank', 'noopener,noreferrer');
    });
  }

  return article;
};

const loadInstagramPosts = async () => {
  const token = grid?.dataset?.igToken?.trim();
  if (!token || !grid) return;

  try {
    const endpoint = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=5&access_token=${encodeURIComponent(
      token
    )}`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('No se pudo consultar Instagram');

    const payload = await response.json();
    const posts = (payload.data || []).slice(0, 5);
    if (!posts.length) return;

    grid.innerHTML = '';
    cards = posts
      .map((post) => createInstagramCard(post))
      .filter(Boolean);
    cards.forEach((card) => grid.appendChild(card));
    bindCards();
  } catch (error) {
    console.warn('No se pudo cargar Instagram, se mantiene catálogo local.', error);
  }
};

bindCards();
loadInstagramPosts();

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
