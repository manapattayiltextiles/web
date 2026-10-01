window.indraSiteConfig = {
  navigation: [
    { label: 'Home', href: 'index.html', activePages: ['index.html'] },
    { label: 'Collections', href: 'explore.html', activePages: ['explore.html', 'product.html'] },
    { label: 'Our Story', href: 'our-story.html', activePages: ['our-story.html'] },
    { label: 'Heritage', href: 'our-story.html#heritage', activePages: [] }
  ],
  headerActions: {
    'index.html': {
      primary: { label: 'Find your fit', href: 'explore.html', visible: true },
      secondary: { label: 'Bag', badge: '0', href: 'product.html', ariaLabel: 'Shopping bag', visible: true }
    },
    'explore.html': {
      primary: { label: 'Find your fit', href: '#collection', visible: true },
      secondary: { label: 'Shop', badge: '↗', href: 'product.html', ariaLabel: 'Featured product', visible: true }
    },
    'our-story.html': {
      primary: { label: 'Explore Indra', href: 'explore.html', visible: true },
      secondary: { label: 'Shop', badge: '↗', href: 'product.html', ariaLabel: 'Featured product', visible: true }
    },
    'product.html': {
      primary: { label: 'Explore styles', href: 'explore.html', visible: true },
      secondary: { label: 'Shop', badge: '↗', href: '#marketplace-links', ariaLabel: 'Shop Indra', visible: true }
    }
  },
  buttonVisibility: {
    // Set a key to false to hide it; specific keys override their group setting.
    'header-menu-toggle': true,
    'header-brand': true,
    'header-navigation': true,
    'header-navigation:heritage': false,
    'footer-brand': true,
    'home-hero:explore': true,
    'home-hero:story': true,
    'story-quote:explore': true,
    'collection-filter': true,
    'product-tab': true,
    'product-thumbnail': true,
    'product-size-option': true
  },
  footer: {
    tagline: 'Made for her every day.',
    columns: [
      {
        label: 'Indra',
        items: [
          { label: 'Our Story', href: 'our-story.html', visible: true },
          { label: 'Collections', href: 'explore.html', visible: true },
          { label: 'Featured Products', href: 'product.html', visible: true },
          { label: 'Collaborations', href: 'index.html#collaborations', visible: true },
          { label: 'Initiatives', href: 'index.html#initiatives', visible: true },
          { label: 'Events', href: 'index.html#events', visible: true }
        ]
      },
      {
        label: 'Customer care',
        items: [
          { label: 'Contact · details to be added', visible: true },
          { label: 'Stores', href: 'index.html#stores', visible: true }
        ]
      },
      {
        label: 'Shop',
        items: [
          { label: 'Amazon', visible: true },
          { label: 'Meesho', visible: true },
          { label: 'Flipkart', visible: true }
        ]
      },
      {
        label: 'Social platforms',
        className: 'footer-social',
        items: [
          { label: 'Instagram', href: 'https://www.instagram.com/indra_klothing/', visible: true },
          { label: 'Facebook', visible: true }
        ]
      }
    ],
    legal: ['Privacy Policy', 'Terms & Conditions', 'Shipping Policy', 'Return Policy'],
    copyrightStartYear: 1980,
    copyright: 'Indra by Manapattayil Textiles. All rights reserved.'
  }
};