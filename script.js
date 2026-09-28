const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    primaryNav.classList.toggle('is-open', !isOpen);
  });

  primaryNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      primaryNav.classList.remove('is-open');
    }
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const products = window.indraProducts || [];
const collectionData = window.indraCollections || [];
const imageFallback = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=82';

function handleImageError(image) {
  if (image.dataset.fallback && image.getAttribute('src') !== image.dataset.fallback) {
    image.src = image.dataset.fallback;
    return;
  }
  image.classList.add('image-unavailable');
}

function makeImage(source, alt, className = '') {
  const image = document.createElement('img');
  image.alt = alt;
  image.dataset.localImage = '';
  image.dataset.fallback = imageFallback;
  if (className) image.className = className;
  image.addEventListener('error', () => handleImageError(image));
  image.src = source;
  return image;
}

document.querySelectorAll('img[data-local-image]').forEach((image) => {
  image.addEventListener('error', () => handleImageError(image));
  if (image.complete && image.naturalWidth === 0) handleImageError(image);
});

function createProductCard(product) {
  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = `product.html?id=${encodeURIComponent(product.id)}`;
  card.dataset.category = product.category.join(' ');

  const imageWrap = document.createElement('div');
  imageWrap.className = 'product-image';
  imageWrap.append(makeImage(product.image, product.imageAlt));
  const meta = document.createElement('div');
  meta.className = 'product-meta';
  const copy = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = product.name;
  const description = document.createElement('p');
  description.textContent = product.description;
  copy.append(title, description);
  meta.append(copy);
  if (product.price) {
    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = product.price;
    meta.append(price);
  }
  card.append(imageWrap, meta);
  return card;
}

function renderProducts(container, entries) {
  if (!container) return;
  container.replaceChildren(...entries.map(createProductCard));
}

renderProducts(document.querySelector('[data-product-grid]'), products);
renderProducts(document.querySelector('[data-featured-products]'), products.filter((product) => product.featured));

const collectionGrid = document.querySelector('[data-collection-grid]');
if (collectionGrid) {
  collectionData.forEach((collection) => {
    const card = document.createElement('a');
    card.className = 'collection-editorial-card';
    card.href = `explore.html?category=${encodeURIComponent(collection.id)}`;
    const imageWrap = document.createElement('div');
    imageWrap.className = 'collection-editorial-image';
    imageWrap.append(makeImage(collection.image, `${collection.name} collection`));
    const title = document.createElement('h3');
    title.textContent = collection.name;
    const line = document.createElement('p');
    line.textContent = collection.line;
    card.append(imageWrap, title, line);
    collectionGrid.append(card);
  });
}

function renderMarketplaces(container, urls = {}) {
  if (!container) return;
  container.replaceChildren();
  (window.indraMarketplaces || []).forEach((marketplace) => {
    const url = urls[`${marketplace.name.toLowerCase()}Url`] || marketplace.url;
    const item = url ? document.createElement('a') : document.createElement('div');
    item.className = 'marketplace-option';
    if (url) {
      item.href = url;
      item.target = '_blank';
      item.rel = 'noreferrer';
    } else {
      item.setAttribute('aria-disabled', 'true');
    }
    const mark = document.createElement('span');
    mark.className = `retailer-mark ${marketplace.className}`;
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = marketplace.name.slice(0, 1);
    const text = document.createElement('span');
    text.className = 'marketplace-copy';
    const name = document.createElement('strong');
    name.textContent = marketplace.name;
    const status = document.createElement('small');
    status.textContent = url ? 'Shop Indra' : 'Official link to be added';
    text.append(name, status);
    item.append(mark, text);
    if (url) {
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      item.append(arrow);
    }
    container.append(item);
  });
}

document.querySelectorAll('[data-marketplaces]').forEach((container) => renderMarketplaces(container));

document.querySelectorAll('[data-social-links]').forEach((container) => {
  (window.indraSocialLinks || []).forEach((profile) => {
    const item = profile.url ? document.createElement('a') : document.createElement('span');
    item.className = 'social-profile';
    if (profile.url) {
      item.href = profile.url;
      item.target = '_blank';
      item.rel = 'noreferrer';
    } else {
      item.setAttribute('aria-disabled', 'true');
    }
    const symbol = document.createElement('span');
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = profile.symbol;
    const label = document.createElement('span');
    label.textContent = profile.name;
    item.append(symbol, label);
    container.append(item);
  });
});

const filterButtons = document.querySelectorAll('[data-filter]');
const productGrid = document.querySelector('[data-product-grid]');
const productCount = document.querySelector('[data-product-count]');

function setProductFilter(filter) {
  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const filtered = filter === 'all'
    ? products
    : products.filter((product) => product.category.includes(filter));
  renderProducts(productGrid, filtered);
  if (productCount) productCount.textContent = String(filtered.length);
}

if (productGrid) {
  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  const knownCategory = collectionData.some((collection) => collection.id === requestedCategory);
  setProductFilter(knownCategory ? requestedCategory : 'all');
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setProductFilter(button.dataset.filter);
    const url = new URL(window.location.href);
    if (button.dataset.filter === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', button.dataset.filter);
    window.history.replaceState({}, '', url);
  });
});

const productId = new URLSearchParams(window.location.search).get('id');
const currentProduct = products.find((product) => product.id === productId) || products[0];
if (currentProduct && document.querySelector('[data-product-name]')) {
  document.title = `${currentProduct.name} | Indra`;
  document.querySelector('[data-product-name]').textContent = currentProduct.name;
  const breadcrumb = document.querySelector('[data-product-breadcrumb]');
  if (breadcrumb) breadcrumb.textContent = currentProduct.name;
  document.querySelector('[data-product-description]').textContent = currentProduct.description;
  document.querySelector('[data-product-detail-text]').textContent = currentProduct.detail;
  const price = document.querySelector('[data-product-price]');
  if (currentProduct.price) {
    price.textContent = currentProduct.price;
    price.hidden = false;
  }
  const availability = document.querySelector('[data-product-availability]');
  const missingDetails = [];
  if (!currentProduct.price) missingDetails.push('pricing');
  if (!currentProduct.sizes.length) missingDetails.push('size availability');
  if (availability) availability.textContent = `${missingDetails.join(' and ')} will be added when confirmed.`;

  const mainImage = document.querySelector('[data-main-product-image]');
  const thumbnails = document.querySelector('[data-product-thumbnails]');
  if (mainImage && currentProduct.gallery.length) {
    mainImage.src = currentProduct.gallery[0].src;
    mainImage.alt = currentProduct.gallery[0].alt;
    if (thumbnails) {
      thumbnails.replaceChildren();
      currentProduct.gallery.forEach((item, index) => {
        const button = document.createElement('button');
        button.className = `thumbnail${index === 0 ? ' is-active' : ''}`;
        button.type = 'button';
        button.setAttribute('aria-label', `View image ${index + 1}: ${item.alt}`);
        const thumbnailImage = makeImage(item.src, '');
        button.append(thumbnailImage);
        button.addEventListener('click', () => {
          mainImage.src = item.src;
          mainImage.alt = item.alt;
          thumbnails.querySelectorAll('.thumbnail').forEach((element) => {
            element.classList.toggle('is-active', element === button);
          });
        });
        thumbnails.append(button);
      });
    }
  }

  const sizePicker = document.querySelector('[data-size-picker]');
  if (sizePicker && currentProduct.sizes.length) {
    sizePicker.hidden = false;
    const options = sizePicker.querySelector('[data-size-options]');
    currentProduct.sizes.forEach((size) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = size;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        options.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        sizePicker.querySelector('.selection-message').textContent = `${size} selected.`;
      });
      options.append(button);
    });
  }

  renderMarketplaces(document.querySelector('[data-product-retailers]'), currentProduct);
  const recommendations = products.filter((product) => product.id !== currentProduct.id).slice(0, 3);
  renderProducts(document.querySelector('[data-recommendations]'), recommendations);
}

const tabButtons = document.querySelectorAll('[data-tab]');
const tabPanels = document.querySelectorAll('.tab-panel');
function activateTab(name) {
  tabButtons.forEach((button) => {
    const selected = button.dataset.tab === name;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  tabPanels.forEach((panel) => {
    panel.hidden = panel.id !== `panel-${name}`;
  });
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => activateTab(button.dataset.tab));
});

const hashTab = { '#tab-care': 'care', '#tab-size': 'size' }[window.location.hash];
if (hashTab) activateTab(hashTab);
window.addEventListener('hashchange', () => {
  const nextTab = { '#tab-care': 'care', '#tab-size': 'size' }[window.location.hash];
  if (nextTab) activateTab(nextTab);
});

document.querySelectorAll('[data-open-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    activateTab(button.dataset.openTab);
    document.querySelector('.product-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});