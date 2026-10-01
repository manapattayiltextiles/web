function createConfiguredLink(item, className = '', visibilityKey = '') {
  const element = document.createElement(item.href ? 'a' : 'span');
  if (className) element.className = className;
  if (visibilityKey) element.dataset.buttonVisibility = visibilityKey;
  element.hidden = item.visible === false;
  element.textContent = item.label;
  if (item.href) {
    element.href = item.href;
    if (item.href.startsWith('https://')) {
      element.target = '_blank';
      element.rel = 'noreferrer';
    }
  }
  return element;
}

function createVisibilityKey(group, label) {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${group}:${slug}`;
}

function renderSiteShell() {
  const config = window.indraSiteConfig;
  if (!config) return;

  const page = window.location.pathname.split('/').pop() || 'index.html';
  const actions = config.headerActions[page] || config.headerActions['index.html'];
  const headerMount = document.querySelector('[data-site-header]');
  if (headerMount) {
    const header = document.createElement('header');
    header.className = 'site-header';

    const brand = document.createElement('a');
    brand.className = 'wordmark';
    brand.href = 'index.html';
    brand.setAttribute('aria-label', 'Indra home');
    brand.dataset.buttonVisibility = 'header-brand';
    brand.append('INDRA');
    const brandLine = document.createElement('span');
    brandLine.textContent = 'by Manapattayil Textiles';
    brand.append(brandLine);

    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'primary-nav');
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.dataset.buttonVisibility = 'header-menu-toggle';
    toggle.innerHTML = '<span></span><span></span>';

    const nav = document.createElement('nav');
    nav.className = 'primary-nav';
    nav.id = 'primary-nav';
    nav.setAttribute('aria-label', 'Main navigation');
    config.navigation.forEach((item) => {
      const link = createConfiguredLink(item, '', createVisibilityKey('header-navigation', item.label));
      if (item.activePages.includes(page)) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
      nav.append(link);
    });

    const headerActions = document.createElement('div');
    headerActions.className = 'header-actions';
    headerActions.append(createConfiguredLink(actions.primary, 'header-link'));
    const secondaryAction = document.createElement('a');
    secondaryAction.className = 'bag-link';
    secondaryAction.href = actions.secondary.href;
    secondaryAction.setAttribute('aria-label', actions.secondary.ariaLabel);
    secondaryAction.hidden = actions.secondary.visible === false;
    secondaryAction.append(actions.secondary.label);
    const badge = document.createElement('span');
    badge.textContent = actions.secondary.badge;
    secondaryAction.append(badge);
    headerActions.append(secondaryAction);

    header.append(brand, toggle, nav, headerActions);
    headerMount.replaceWith(header);
  }

  const footerMount = document.querySelector('[data-site-footer]');
  if (footerMount) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    const footerMain = document.createElement('div');
    footerMain.className = 'footer-main';

    const footerBrand = document.createElement('div');
    footerBrand.className = 'footer-brand';
    const footerWordmark = document.createElement('a');
    footerWordmark.className = 'wordmark';
    footerWordmark.href = 'index.html';
    footerWordmark.dataset.buttonVisibility = 'footer-brand';
    footerWordmark.append('INDRA');
    const footerBrandLine = document.createElement('span');
    footerBrandLine.textContent = 'by Manapattayil Textiles';
    footerWordmark.append(footerBrandLine);
    const tagline = document.createElement('p');
    tagline.textContent = config.footer.tagline;
    footerBrand.append(footerWordmark, tagline);
    footerMain.append(footerBrand);

    config.footer.columns.forEach((column) => {
      const nav = document.createElement('nav');
      nav.className = `footer-column${column.className ? ` ${column.className}` : ''}`;
      nav.setAttribute('aria-label', column.label);
      const heading = document.createElement('h2');
      heading.textContent = column.label === 'Social platforms' ? 'Social' : column.label;
      nav.append(heading);
      column.items.forEach((item) => {
        nav.append(createConfiguredLink(item));
      });
      footerMain.append(nav);
    });

    const footerBottom = document.createElement('div');
    footerBottom.className = 'footer-bottom';
    const legal = document.createElement('div');
    legal.className = 'footer-legal';
    config.footer.legal.forEach((label) => {
      const item = document.createElement('span');
      item.textContent = label;
      legal.append(item);
    });
    const copyright = document.createElement('small');
    copyright.append(`© ${config.footer.copyrightStartYear}–`);
    const year = document.createElement('span');
    year.dataset.year = '';
    copyright.append(year, ` ${config.footer.copyright}`);
    footerBottom.append(legal, copyright);
    footer.append(footerMain, footerBottom);
    footerMount.replaceWith(footer);
  }
}

renderSiteShell();

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

function applyButtonVisibility() {
  const visibility = window.indraSiteConfig?.buttonVisibility || {};
  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.dataset.buttonVisibility = `collection-filter:${button.dataset.filter}`;
  });
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.dataset.buttonVisibility = `product-tab:${button.dataset.tab}`;
  });
  document.querySelectorAll('[data-button-visibility]').forEach((control) => {
    const key = control.dataset.buttonVisibility;
    const group = key.split(':')[0];
    const isVisible = visibility[key] ?? visibility[group] ?? true;
    control.hidden = isVisible === false;
  });
}

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

const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const updateHeaderSize = () => {
    siteHeader.classList.toggle('is-compact', window.scrollY > 32);
  };
  updateHeaderSize();
  window.addEventListener('scroll', updateHeaderSize, { passive: true });
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

function createMarketplaceIcon(name) {
  const namespace = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(namespace, 'svg');
  icon.setAttribute('viewBox', '0 0 28 28');
  icon.setAttribute('class', `marketplace-icon marketplace-icon-${name.toLowerCase()}`);
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('focusable', 'false');

  const shape = (tag, attributes, text = '') => {
    const element = document.createElementNS(namespace, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (text) element.textContent = text;
    icon.append(element);
  };

  if (name === 'Amazon') {
    shape('text', { x: '13', y: '17', 'text-anchor': 'middle', 'font-family': 'Arial, sans-serif', 'font-size': '17', 'font-weight': '700', fill: 'currentColor' }, 'a');
    shape('path', { d: 'M4.5 19.1c5.2 3.3 12.8 3.4 18 .1', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round' });
    shape('path', { d: 'm19.4 17.7 3.1 1.3-2.8 1.8', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  } else if (name === 'Meesho') {
    shape('path', { d: 'M4.5 20V8h3v1.7c.7-1.2 1.7-1.9 3-1.9 1.5 0 2.5.7 3 2 .7-1.3 1.8-2 3.3-2 2.4 0 3.8 1.6 3.8 4.2V20h-3.2v-7.5c0-1.2-.5-1.9-1.4-1.9-1 0-1.6.8-1.6 2.2V20h-3.2v-7.5c0-1.2-.5-1.9-1.4-1.9-1 0-1.6.8-1.6 2.2V20z', fill: 'currentColor' });
  } else if (name === 'Flipkart') {
    shape('path', { d: 'M8 9V7a6 6 0 0 1 12 0v2', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' });
    shape('path', { d: 'M5.5 9h17l-1.5 15h-14z', fill: 'currentColor' });
    shape('path', { d: 'M11 12h6v2.2h-3.7v1.4h3.2v2h-3.2v2.2H11z', fill: '#ffd23f' });
  } else {
    return null;
  }

  return icon;
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
    }
    const mark = createMarketplaceIcon(marketplace.name);
    const text = document.createElement('span');
    text.className = 'marketplace-copy';
    const name = document.createElement('strong');
    name.textContent = marketplace.name;
    text.append(name);
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

function createSocialIcon(name) {
  const namespace = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(namespace, 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('class', `social-icon social-icon-${name.toLowerCase()}`);
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('focusable', 'false');

  const shape = (tag, attributes) => {
    const element = document.createElementNS(namespace, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    icon.append(element);
  };

  if (name === 'Instagram') {
    shape('rect', { x: '3', y: '3', width: '18', height: '18', rx: '5', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' });
    shape('circle', { cx: '12', cy: '12', r: '4', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' });
    shape('circle', { cx: '17.5', cy: '6.5', r: '1.2', fill: 'currentColor' });
  } else if (name === 'Facebook') {
    shape('path', { d: 'M13.4 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2V10H7.7v3h2.6v8h3.1z', fill: 'currentColor' });
  } else if (name === 'YouTube') {
    shape('rect', { x: '2.5', y: '5', width: '19', height: '14', rx: '4', fill: 'currentColor' });
    shape('path', { d: 'M10 8.8v6.4l5.4-3.2z', fill: '#ffffff' });
  } else {
    return null;
  }

  return icon;
}

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
    const icon = createSocialIcon(profile.name);
    const label = document.createElement('span');
    label.textContent = profile.name;
    if (icon) item.append(icon);
    item.append(label);
    container.append(item);
  });
});

document.querySelectorAll('.footer-social > span, .footer-social > a').forEach((profile) => {
  const name = profile.textContent.split('·')[0].trim();
  const icon = createSocialIcon(name);
  if (icon) profile.prepend(icon);
});

document.querySelectorAll('.footer-column[aria-label="Shop"] > span').forEach((platform) => {
  const name = platform.textContent.split('·')[0].trim();
  const icon = createMarketplaceIcon(name);
  if (icon) platform.prepend(icon);
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
        button.dataset.buttonVisibility = `product-thumbnail:${index + 1}`;
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
      button.dataset.buttonVisibility = `product-size-option:${size.toLowerCase()}`;
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

applyButtonVisibility();