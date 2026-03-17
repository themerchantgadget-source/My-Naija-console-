// ─── Naija Console — Data Layer ───────────────────────────────────────────────

// ─── FX Rates ─────────────────────────────────────────────────────────────────
const FX_RATES = [
  { currency: 'USD', rate: 1650 },
  { currency: 'GBP', rate: 2140 },
  { currency: 'EUR', rate: 1780 },
  { currency: 'CAD', rate: 1210 },
  { currency: 'AED', rate: 450 },
  { currency: 'SAR', rate: 440 },
  { currency: 'CNY', rate: 228 },
];

// ─── Zones ────────────────────────────────────────────────────────────────────
const ZONES = [
  'All Rivers State',
  'Port Harcourt CBD',
  'GRA Phase 1 & 2',
  'Choba / UniPort',
  'Trans-Amadi',
  'Rumuola / Rumuokoro',
  'D/Line',
  'Eleme / Oyigbo',
];

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Fashion', 'Electronics', 'Home', 'Sports', 'Art', 'Books', 'Vehicles'];

// ─── Current User ─────────────────────────────────────────────────────────────
const CURRENT_USER = {
  id: 'me',
  name: 'Maro Sovereign',
  handle: '@maro',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop',
  isVerified: true,
  trustScore: 98,
  location: 'Port Harcourt',
  sales: 47,
  isFollowing: false,
};

// ─── Mock Users ───────────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Adaeze Okonkwo',
    handle: '@adaeze_ph',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&fit=crop',
    isVerified: true,
    trustScore: 96,
    location: 'GRA Phase 2',
    sales: 124,
    isFollowing: false,
  },
  {
    id: 'u2',
    name: 'Emeka Nwosu',
    handle: '@emeka_tech',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop',
    isVerified: true,
    trustScore: 99,
    location: 'Trans-Amadi',
    sales: 312,
    isFollowing: true,
  },
  {
    id: 'u3',
    name: 'Chioma Eze',
    handle: '@chioma_style',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&fit=crop',
    isVerified: false,
    trustScore: 87,
    location: 'D/Line',
    sales: 56,
    isFollowing: false,
  },
  {
    id: 'u4',
    name: 'Tunde Bakare',
    handle: '@tunde_motors',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&fit=crop',
    isVerified: true,
    trustScore: 94,
    location: 'Port Harcourt CBD',
    sales: 89,
    isFollowing: false,
  },
  {
    id: 'u5',
    name: 'Ngozi Amadi',
    handle: '@ngozi_home',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&fit=crop',
    isVerified: false,
    trustScore: 91,
    location: 'Rumuola',
    sales: 34,
    isFollowing: false,
  },
];

// ─── Mock Listings ────────────────────────────────────────────────────────────
const MOCK_LISTINGS = [
  {
    id: 'l1',
    sellerId: 'u1',
    seller: MOCK_USERS[0],
    title: 'Vintage Ankara Dress — Hand-Stitched, Size M/L',
    description: 'Authentic hand-stitched Ankara dress from a Kano artisan. Rich indigo and gold pattern. Worn once for a photoshoot. Size M/L. Comes with matching headwrap. Pickup in GRA or rider delivery available.',
    price: 8500,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4e5d?w=600&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&fit=crop',
    ],
    category: 'Fashion',
    condition: 'Like New',
    status: 'available',
    listingType: 'fixed',
    zone: 'GRA Phase 1 & 2',
    likes: 47,
    comments: 12,
    shares: 8,
    isLiked: false,
    isSaved: false,
    createdAt: '2h ago',
    location: 'GRA Phase 2',
    escrowEnabled: true,
    sustainability: true,
    priceScout: {
      score: 'Excellent',
      marketMin: 9500,
      marketMax: 18000,
      analysis: 'This Ankara dress is priced 55% below the GRA Phase 2 market average of ₦18,000. Exceptional value — similar pieces from Kano artisans sell for ₦12,000–₦18,000 in Port Harcourt.',
    },
  },
  {
    id: 'l2',
    sellerId: 'u2',
    seller: MOCK_USERS[1],
    title: 'iPhone 14 Pro 256GB — Space Black, Unlocked',
    description: 'iPhone 14 Pro 256GB Space Black. Purchased from UK, fully unlocked, works on all Nigerian networks. Battery health 94%. No scratches. Comes with original box, cable, and UK charger adapter. Escrow only.',
    price: 420000,
    images: [
      'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&fit=crop',
    ],
    category: 'Electronics',
    condition: 'Like New',
    status: 'available',
    listingType: 'auction',
    zone: 'Trans-Amadi',
    likes: 134,
    comments: 56,
    shares: 23,
    isLiked: false,
    isSaved: false,
    createdAt: '4h ago',
    location: 'Trans-Amadi',
    escrowEnabled: true,
    auctionEndsAt: '2h 14m',
    currentBid: 392000,
    bidCount: 17,
    bids: [
      { bidderId: 'u3', bidderName: 'Chioma Eze', amount: 392000, time: '5m ago' },
      { bidderId: 'u4', bidderName: 'Tunde Bakare', amount: 385000, time: '12m ago' },
    ],
    priceScout: {
      score: 'Fair',
      marketMin: 380000,
      marketMax: 480000,
      analysis: 'Current bid of ₦392,000 is within the Trans-Amadi market range for iPhone 14 Pro (₦380K–₦480K). Auction is active — final price likely to settle at ₦410,000–₦430,000 based on bid velocity.',
    },
  },
  {
    id: 'l3',
    sellerId: 'u3',
    seller: MOCK_USERS[2],
    title: 'Yeezy Boost 350 V2 — Zebra, Size 42',
    description: 'Authentic Yeezy Boost 350 V2 Zebra. Size 42 EU / 8.5 US. Purchased from Adidas online store. Worn 3 times. Box included. Authentication card available. Pickup D/Line or delivery.',
    price: 65000,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&fit=crop',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&fit=crop',
    ],
    category: 'Fashion',
    condition: 'Good',
    status: 'available',
    listingType: 'fixed',
    zone: 'D/Line',
    likes: 89,
    comments: 34,
    shares: 15,
    isLiked: false,
    isSaved: false,
    createdAt: '6h ago',
    location: 'D/Line',
    escrowEnabled: true,
    priceScout: {
      score: 'Excellent',
      marketMin: 75000,
      marketMax: 120000,
      analysis: 'Priced 35% below the D/Line market average for authentic Yeezy 350 V2 (₦75K–₦120K). Excellent deal — authentication card adds significant confidence.',
    },
  },
  {
    id: 'l4',
    sellerId: 'u4',
    seller: MOCK_USERS[3],
    title: 'Toyota Camry 2015 — XLE, Full Option, Clean',
    description: '2015 Toyota Camry XLE. Full option — leather seats, sunroof, reverse camera, Bluetooth. Accident-free. Nigerian customs duty paid. 78,000km. Registered in Rivers State. Test drive available at Port Harcourt CBD.',
    price: 8200000,
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&fit=crop',
    ],
    category: 'Vehicles',
    condition: 'Good',
    status: 'available',
    listingType: 'fixed',
    zone: 'Port Harcourt CBD',
    likes: 203,
    comments: 78,
    shares: 45,
    isLiked: false,
    isSaved: false,
    createdAt: '1d ago',
    location: 'Port Harcourt CBD',
    escrowEnabled: true,
    priceScout: {
      score: 'Fair',
      marketMin: 7800000,
      marketMax: 9500000,
      analysis: 'Priced within the Port Harcourt market range for 2015 Camry XLE (₦7.8M–₦9.5M). Full option spec and clean history justify the pricing. Comparable listings average ₦8.5M.',
    },
  },
  {
    id: 'l5',
    sellerId: 'u5',
    seller: MOCK_USERS[4],
    title: 'MacBook Pro M2 — 13", 8GB/256GB, Space Grey',
    description: 'MacBook Pro M2 2022. 13-inch, 8GB RAM, 256GB SSD, Space Grey. Battery cycles: 42. No dents or scratches. macOS Sonoma. Comes with original charger and box. Ideal for students and creatives.',
    price: 580000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&fit=crop',
      'https://images.unsplash.com/photo-1611186871525-9f4e9c0c3b7e?w=600&fit=crop',
    ],
    category: 'Electronics',
    condition: 'Like New',
    status: 'available',
    listingType: 'fixed',
    zone: 'Choba / UniPort',
    likes: 67,
    comments: 22,
    shares: 11,
    isLiked: false,
    isSaved: false,
    createdAt: '2d ago',
    location: 'Choba',
    escrowEnabled: true,
    priceScout: {
      score: 'Overpriced',
      marketMin: 480000,
      marketMax: 560000,
      analysis: 'This MacBook M2 is priced ₦20,000 above the Choba / UniPort market ceiling of ₦560,000. Comparable listings with similar specs average ₦520,000. Negotiation recommended.',
    },
  },
  {
    id: 'l6',
    sellerId: 'u1',
    seller: MOCK_USERS[0],
    title: 'Handmade Leather Tote Bag — Cognac Brown',
    description: 'Handcrafted full-grain leather tote bag. Cognac brown. Made by a Port Harcourt artisan. Fits 15" laptop. Interior zip pocket and two open pockets. Adjustable strap. Sustainable, locally made.',
    price: 22000,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&fit=crop',
    ],
    category: 'Fashion',
    condition: 'New',
    status: 'available',
    listingType: 'fixed',
    zone: 'GRA Phase 1 & 2',
    likes: 38,
    comments: 9,
    shares: 6,
    isLiked: false,
    isSaved: false,
    createdAt: '3d ago',
    location: 'GRA Phase 1',
    escrowEnabled: true,
    sustainability: true,
    priceScout: {
      score: 'Excellent',
      marketMin: 28000,
      marketMax: 55000,
      analysis: 'Full-grain leather tote bags of this quality typically sell for ₦28,000–₦55,000 in GRA. This locally-made piece is priced 21% below market — excellent value and supports local artisans.',
    },
  },
];

// ─── App State ────────────────────────────────────────────────────────────────
const AppState = {
  activeZone: 'All Rivers State',
  activeCategory: 'All',
  searchQuery: '',
  cart: [],
  wishlist: [],

  formatPrice(amount) {
    if (amount >= 1000000) return '₦' + (amount / 1000000).toFixed(1) + 'M';
    if (amount >= 1000) return '₦' + amount.toLocaleString();
    return '₦' + amount;
  },

  getFilteredListings() {
    return MOCK_LISTINGS.filter(l => {
      const zoneMatch = this.activeZone === 'All Rivers State' || l.zone === this.activeZone;
      const catMatch = this.activeCategory === 'All' || l.category === this.activeCategory;
      const searchMatch = !this.searchQuery ||
        l.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.zone.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.seller.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return zoneMatch && catMatch && searchMatch;
    });
  },

  addToCart(listing) {
    const existing = this.cart.find(i => i.id === listing.id);
    if (existing) {
      existing.qty++;
    } else {
      this.cart.push({ ...listing, qty: 1 });
    }
    this.updateCartBadge();
  },

  removeFromCart(id) {
    this.cart = this.cart.filter(i => i.id !== id);
    this.updateCartBadge();
  },

  getCartTotal() {
    return this.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const count = this.cart.reduce((s, i) => s + i.qty, 0);
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  toggleWishlist(listing) {
    const idx = this.wishlist.findIndex(w => w.id === listing.id);
    if (idx >= 0) {
      this.wishlist.splice(idx, 1);
    } else {
      this.wishlist.push(listing);
    }
  },
};
