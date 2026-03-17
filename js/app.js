// ─── Naija Console — App Logic ────────────────────────────────────────────────

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, icon = '✅') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${icon}</span> ${msg}`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ─── FX Ticker ────────────────────────────────────────────────────────────────
function renderFxTicker() {
  const items = [...FX_RATES, ...FX_RATES].map(fx => `
    <div class="fx-item">
      <div class="fx-live-dot"></div>
      <span class="fx-label">${fx.currency}</span>
      <span class="fx-naira">₦${fx.rate.toLocaleString()}</span>
    </div>
  `).join('');

  document.getElementById('fx-ticker-inner').innerHTML = items;
}

// ─── Stories Row ──────────────────────────────────────────────────────────────
function renderStories() {
  const container = document.getElementById('stories-row');
  const addStory = `
    <div class="story-item">
      <div class="story-ring add-story" style="display:flex;align-items:center;justify-content:center;font-size:24px;color:var(--white-40)">+</div>
      <span class="story-name">Your Story</span>
    </div>`;

  const stories = MOCK_USERS.map(u => `
    <div class="story-item" onclick="showToast('${u.name}&apos;s story', '📖')">
      <div class="story-ring">
        <img class="story-avatar" src="${u.avatar}" alt="${u.name}" loading="lazy">
      </div>
      <span class="story-name">${u.name.split(' ')[0]}</span>
    </div>`).join('');

  container.innerHTML = addStory + stories;
}

// ─── Zone Selector ────────────────────────────────────────────────────────────
function renderZones() {
  const container = document.getElementById('zone-bar');
  container.innerHTML = ZONES.map(z => `
    <button class="zone-chip ${z === AppState.activeZone ? 'active' : ''}"
      onclick="selectZone('${z.replace(/'/g, "\\'")}')">
      ${z === 'All Rivers State' ? '📍 ' : ''}${z}
    </button>`).join('');
}

function selectZone(zone) {
  AppState.activeZone = zone;
  renderZones();
  renderFeed();
}

// ─── Category Bar ─────────────────────────────────────────────────────────────
function renderCatBar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = CATEGORIES.map(c => `
    <button class="cat-chip ${c === AppState.activeCategory ? 'active' : ''}"
      onclick="selectCategory('${c}', '${containerId}')">
      ${c}
    </button>`).join('');
}

function selectCategory(cat, containerId) {
  AppState.activeCategory = cat;
  renderCatBar(containerId);
  renderFeed();
  renderExplore();
}

// ─── Feature Row ──────────────────────────────────────────────────────────────
function renderFeatureRow() {
  const features = [
    { icon: '🎬', label: 'Reels', action: "openModal('reels-modal')" },
    { icon: '🔴', label: 'Live', action: "openModal('live-modal')" },
    { icon: '👥', label: 'Groups', action: "openModal('groups-modal')" },
    { icon: '🎙️', label: 'Voice', action: "openModal('voice-modal')" },
    { icon: '❤️', label: 'Wishlist', action: "openModal('wishlist-modal')" },
    { icon: '📊', label: 'Dashboard', action: "openModal('dashboard-modal')" },
    { icon: '🪞', label: 'AR Try-On', action: "openModal('ar-modal')" },
    { icon: '🛡️', label: 'Verify', action: "openModal('verify-modal')" },
  ];

  document.getElementById('feature-row').innerHTML = features.map(f => `
    <div class="feature-btn" onclick="${f.action}">
      <div class="feature-icon-wrap">${f.icon}</div>
      <span class="feature-label">${f.label}</span>
    </div>`).join('');
}

// ─── Listing Card ─────────────────────────────────────────────────────────────
function getScoreClass(score) {
  return score === 'Excellent' ? 'excellent' : score === 'Fair' ? 'fair' : 'overpriced';
}

function renderListingCard(l) {
  const isAuction = l.listingType === 'auction';
  const isSaved = AppState.wishlist.some(w => w.id === l.id);

  return `
    <div class="listing-card fade-in" id="card-${l.id}">
      <div class="card-header">
        <img class="card-avatar" src="${l.seller.avatar}" alt="${l.seller.name}" loading="lazy">
        <div class="card-seller-info">
          <div class="card-seller-name">
            ${l.seller.name}
            ${l.seller.isVerified ? '<span class="verified-badge">✓</span>' : ''}
          </div>
          <div class="card-seller-handle">${l.seller.handle} · ${l.createdAt}</div>
        </div>
        <div class="card-badges">
          <span class="zone-badge">${l.zone.replace('All Rivers State', 'Rivers').replace('GRA Phase 1 & 2', 'GRA')}</span>
          ${l.escrowEnabled ? '<span class="escrow-badge">🔒 ESCROW</span>' : ''}
        </div>
      </div>

      <div class="card-title">${l.title}</div>

      <div class="card-image-wrap" onclick="openListingDetail('${l.id}')">
        <img class="card-image" src="${l.images[0]}" alt="${l.title}" loading="lazy">
        ${isAuction ? `<div class="auction-overlay">⚡ LIVE BID · ${l.auctionEndsAt}</div>` : ''}
      </div>

      <div class="card-price-row">
        <div class="card-price">${isAuction ? AppState.formatPrice(l.currentBid || l.price) : AppState.formatPrice(l.price)}</div>
        ${l.priceScout ? `
          <div class="price-scout-badge ${getScoreClass(l.priceScout.score)}">
            ⚡ ${l.priceScout.score}
          </div>` : ''}
      </div>

      <div class="card-tags">
        <span class="card-tag">${l.condition}</span>
        <span class="card-tag">${l.category}</span>
        ${isAuction ? `<span class="card-tag" style="color:var(--amber);border-color:rgba(255,179,0,0.3)">${l.bidCount} bids</span>` : ''}
      </div>

      <div class="card-actions">
        <button class="card-action-btn ${l.isLiked ? 'liked' : ''}" onclick="toggleLike('${l.id}', this)">
          ${l.isLiked ? '❤️' : '🤍'} <span class="like-count-${l.id}">${l.likes}</span>
        </button>
        <button class="card-action-btn" onclick="openListingDetail('${l.id}')">
          💬 ${l.comments}
        </button>
        <button class="card-action-btn" onclick="shareWhatsApp('${l.id}')">
          📤 ${l.shares}
        </button>
        <button class="card-action-btn ${isSaved ? 'saved' : ''}" onclick="toggleWishlist('${l.id}', this)">
          ${isSaved ? '🔖' : '🏷️'}
        </button>
        <button class="card-buy-btn" onclick="${isAuction ? `openListingDetail('${l.id}')` : `addToCart('${l.id}')`}">
          ${isAuction ? '⚡ Bid' : 'Buy'}
        </button>
      </div>
    </div>`;
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
function renderFeed() {
  const container = document.getElementById('feed-container');
  const listings = AppState.getFilteredListings();

  if (listings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No listings found</div>
        <div class="empty-state-sub">Try a different zone or category</div>
      </div>`;
    return;
  }

  container.innerHTML = listings.map(renderListingCard).join('');
}

// ─── Explore ──────────────────────────────────────────────────────────────────
function renderExplore() {
  const container = document.getElementById('explore-grid');
  if (!container) return;
  const listings = AppState.getFilteredListings();

  container.innerHTML = listings.map(l => `
    <div class="explore-card" onclick="openListingDetail('${l.id}')">
      <img class="explore-card-img" src="${l.images[0]}" alt="${l.title}" loading="lazy">
      <div class="explore-card-info">
        <div class="explore-card-title">${l.title}</div>
        <div class="explore-card-price">${AppState.formatPrice(l.price)}</div>
      </div>
    </div>`).join('');
}

// ─── Listing Detail ───────────────────────────────────────────────────────────
function openListingDetail(id) {
  const l = MOCK_LISTINGS.find(x => x.id === id);
  if (!l) return;

  const isAuction = l.listingType === 'auction';
  const modal = document.getElementById('listing-detail-modal');

  modal.querySelector('.modal-title').textContent = '';

  const body = modal.querySelector('.modal-body');
  body.innerHTML = `
    <div class="detail-carousel">
      <img id="detail-main-img" src="${l.images[0]}" alt="${l.title}">
      <div class="carousel-dots">
        ${l.images.map((_, i) => `<div class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="switchCarousel(${i}, '${id}')"></div>`).join('')}
      </div>
    </div>

    <div class="detail-seller-row">
      <img class="detail-seller-avatar" src="${l.seller.avatar}" alt="${l.seller.name}">
      <div>
        <div class="detail-seller-name flex items-center gap-8">
          ${l.seller.name}
          ${l.seller.isVerified ? '<span class="verified-badge">✓</span>' : ''}
          ${l.seller.trustScore ? `<span style="font-size:12px;color:var(--cyan);font-weight:600">Trust ${l.seller.trustScore}%</span>` : ''}
        </div>
        <div class="detail-seller-handle">${l.seller.handle} · ${l.seller.location}</div>
      </div>
      <button class="follow-btn ${l.seller.isFollowing ? 'following' : ''}" onclick="toggleFollow(this, '${l.seller.id}')" style="margin-left:auto">
        ${l.seller.isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>

    <div class="detail-price">${AppState.formatPrice(l.price)}</div>
    <div class="detail-title">${l.title}</div>
    <div class="detail-desc">${l.description}</div>

    ${l.priceScout ? `
    <div class="price-scout-panel">
      <div class="price-scout-header">⚡ xAI Price Scout — <span class="price-scout-badge ${getScoreClass(l.priceScout.score)}" style="display:inline-flex;padding:2px 8px">${l.priceScout.score}</span></div>
      <div class="price-scout-analysis">${l.priceScout.analysis}</div>
      <div class="price-scout-range">
        <div class="price-scout-stat">Market Min: <span>${AppState.formatPrice(l.priceScout.marketMin)}</span></div>
        <div class="price-scout-stat">Market Max: <span>${AppState.formatPrice(l.priceScout.marketMax)}</span></div>
      </div>
    </div>` : ''}

    ${isAuction ? `
    <div class="bid-panel">
      <div class="bid-header">
        <div class="bid-title">⚡ Live Auction</div>
        <div class="bid-timer">⏱ ${l.auctionEndsAt}</div>
      </div>
      <div class="bid-current">${AppState.formatPrice(l.currentBid || l.price)}</div>
      <div class="bid-count">${l.bidCount} bids · ${l.bids ? l.bids[0].bidderName + ' is leading' : ''}</div>
      <div class="bid-input-row">
        <input class="bid-input" type="number" id="bid-amount-${id}" placeholder="Enter your bid amount" value="${(l.currentBid || l.price) + 5000}">
        <button class="bid-submit-btn" onclick="placeBid('${id}')">Place Bid</button>
      </div>
    </div>` : ''}

    ${l.escrowEnabled ? `
    <div style="background:var(--green-dim);border:1px solid rgba(0,200,83,0.3);border-radius:var(--radius);padding:12px 14px;margin-bottom:16px;font-size:13px;color:var(--green)">
      🔒 <strong>Escrow Protected</strong> — Your payment is held safely until you confirm delivery. Sovereign protection on every deal.
    </div>` : ''}

    <div class="detail-action-row">
      <button class="detail-btn detail-btn-primary" onclick="addToCart('${id}');closeModal('listing-detail-modal')">
        🛒 Add to Cart
      </button>
      <button class="detail-btn detail-btn-secondary" onclick="openModal('chat-modal');closeModal('listing-detail-modal')">
        💬 Message
      </button>
      <button class="detail-btn detail-btn-secondary" onclick="shareWhatsApp('${id}')">
        📲 WhatsApp
      </button>
    </div>`;

  openModal('listing-detail-modal');
}

function switchCarousel(idx, listingId) {
  const l = MOCK_LISTINGS.find(x => x.id === listingId);
  if (!l || !l.images[idx]) return;
  document.getElementById('detail-main-img').src = l.images[idx];
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

// ─── Interactions ─────────────────────────────────────────────────────────────
function toggleLike(id, btn) {
  const l = MOCK_LISTINGS.find(x => x.id === id);
  if (!l) return;
  l.isLiked = !l.isLiked;
  l.likes += l.isLiked ? 1 : -1;
  btn.classList.toggle('liked', l.isLiked);
  btn.innerHTML = `${l.isLiked ? '❤️' : '🤍'} <span class="like-count-${id}">${l.likes}</span>`;
}

function toggleWishlist(id, btn) {
  const l = MOCK_LISTINGS.find(x => x.id === id);
  if (!l) return;
  AppState.toggleWishlist(l);
  const saved = AppState.wishlist.some(w => w.id === id);
  btn.classList.toggle('saved', saved);
  btn.textContent = saved ? '🔖' : '🏷️';
  showToast(saved ? 'Added to Wishlist' : 'Removed from Wishlist', saved ? '🔖' : '🏷️');
}

function toggleFollow(btn, userId) {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) return;
  user.isFollowing = !user.isFollowing;
  btn.classList.toggle('following', user.isFollowing);
  btn.textContent = user.isFollowing ? 'Following' : 'Follow';
  showToast(user.isFollowing ? `Following ${user.name}` : `Unfollowed ${user.name}`, user.isFollowing ? '👤' : '');
}

function addToCart(id) {
  const l = MOCK_LISTINGS.find(x => x.id === id);
  if (!l) return;
  AppState.addToCart(l);
  showToast(`${l.title} added to cart`, '🛒');
}

function placeBid(id) {
  const l = MOCK_LISTINGS.find(x => x.id === id);
  const input = document.getElementById(`bid-amount-${id}`);
  if (!l || !input) return;
  const amount = parseInt(input.value);
  if (!amount || amount <= (l.currentBid || l.price)) {
    showToast('Bid must be higher than current bid', '⚠️');
    return;
  }
  l.currentBid = amount;
  l.bidCount++;
  showToast(`Bid of ${AppState.formatPrice(amount)} placed!`, '⚡');
  closeModal('listing-detail-modal');
  renderFeed();
}

function shareWhatsApp(id) {
  const l = MOCK_LISTINGS.find(x => x.id === id);
  if (!l) return;
  const text = encodeURIComponent(`🛍️ ${l.title}\n💰 ${AppState.formatPrice(l.price)}\n📍 ${l.zone}\n\nCheck it out on Naija Console!`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <div class="empty-state-text">Your cart is empty</div>
        <div class="empty-state-sub">Add items from the feed</div>
      </div>`;
    document.getElementById('cart-total-row').style.display = 'none';
    return;
  }

  container.innerHTML = AppState.cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.images[0]}" alt="${item.title}" loading="lazy">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">${AppState.formatPrice(item.price)}</div>
        <div style="font-size:12px;color:var(--white-40);margin-top:2px">Qty: ${item.qty}</div>
      </div>
      <button class="cart-remove-btn" onclick="removeFromCart('${item.id}')">✕</button>
    </div>`).join('');

  document.getElementById('cart-total-row').style.display = 'flex';
  document.getElementById('cart-total-value').textContent = AppState.formatPrice(AppState.getCartTotal());
}

function removeFromCart(id) {
  AppState.removeFromCart(id);
  renderCart();
  showToast('Removed from cart', '🗑️');
}

function openCart() {
  renderCart();
  openModal('cart-modal');
}

function proceedToCheckout() {
  if (AppState.cart.length === 0) {
    showToast('Your cart is empty', '⚠️');
    return;
  }
  closeModal('cart-modal');
  openModal('checkout-modal');
  document.getElementById('checkout-total').textContent = AppState.formatPrice(AppState.getCartTotal() + 1500);
}

function placeOrder() {
  AppState.cart = [];
  AppState.updateCartBadge();
  closeModal('checkout-modal');
  openModal('order-success-modal');
}

// ─── Wishlist Modal ───────────────────────────────────────────────────────────
function renderWishlist() {
  const container = document.getElementById('wishlist-items');
  if (!container) return;

  if (AppState.wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔖</div>
        <div class="empty-state-text">No saved items yet</div>
        <div class="empty-state-sub">Tap 🏷️ on any listing to save it</div>
      </div>`;
    return;
  }

  container.innerHTML = AppState.wishlist.map(l => `
    <div class="cart-item">
      <img class="cart-item-img" src="${l.images[0]}" alt="${l.title}" loading="lazy">
      <div class="cart-item-info">
        <div class="cart-item-title">${l.title}</div>
        <div class="cart-item-price">${AppState.formatPrice(l.price)}</div>
        <div style="font-size:12px;color:var(--green);margin-top:2px">⚡ ${l.priceScout ? l.priceScout.score : 'Good deal'}</div>
      </div>
      <button class="card-buy-btn" onclick="addToCart('${l.id}');showToast('Added to cart','🛒')">Buy</button>
    </div>`).join('');
}

// ─── Notifications ────────────────────────────────────────────────────────────
const MOCK_NOTIFS = [
  { type: 'bid', actor: MOCK_USERS[2], text: 'outbid you on iPhone 14 Pro. Current bid: ₦397,000', time: '5m ago', unread: true },
  { type: 'like', actor: MOCK_USERS[1], text: 'liked your listing', time: '1h ago', unread: true },
  { type: 'escrow', actor: MOCK_USERS[0], text: 'released escrow for your Ankara Dress order. ₦8,500 credited.', time: '2h ago', unread: false },
  { type: 'follow', actor: MOCK_USERS[3], text: 'started following you', time: '3h ago', unread: false },
  { type: 'sale', actor: MOCK_USERS[2], text: 'purchased your Vintage Ankara Dress', time: '1d ago', unread: false },
];

const NOTIF_ICONS = { bid: '⚡', like: '❤️', escrow: '🔒', follow: '👤', sale: '🛍️', comment: '💬', message: '✉️' };

function renderNotifications() {
  const container = document.getElementById('notif-list');
  if (!container) return;

  container.innerHTML = MOCK_NOTIFS.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <img class="notif-avatar" src="${n.actor.avatar}" alt="${n.actor.name}" loading="lazy">
      <div style="flex:1;min-width:0">
        <div class="notif-text"><strong>${n.actor.name}</strong> ${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${n.unread ? '<div class="notif-unread-dot"></div>' : ''}
    </div>`).join('');
}

// ─── Modal System ─────────────────────────────────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Lazy render modal content
  if (id === 'cart-modal') renderCart();
  if (id === 'wishlist-modal') renderWishlist();
  if (id === 'notif-modal') renderNotifications();
  if (id === 'reels-modal' && typeof renderReelsModal === 'function') renderReelsModal();
  if (id === 'groups-modal' && typeof renderGroupsModal === 'function') renderGroupsModal();
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ─── Navigation ───────────────────────────────────────────────────────────────
function navigate(page) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link, .bottom-nav-item').forEach(l => l.classList.remove('active'));

  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  document.querySelectorAll(`[data-page="${page}"]`).forEach(l => l.classList.add('active'));

  if (page === 'explore') renderExplore();
  if (page === 'notifications') renderNotifications();

  window.scrollTo(0, 0);
}

// ─── Search ───────────────────────────────────────────────────────────────────
function handleSearch(query) {
  AppState.searchQuery = query;
  renderFeed();
  renderExplore();
}

// ─── Create Listing ───────────────────────────────────────────────────────────
function submitListing(e) {
  e.preventDefault();
  const title = document.getElementById('new-title').value;
  const price = parseInt(document.getElementById('new-price').value);
  const category = document.getElementById('new-category').value;
  const zone = document.getElementById('new-zone').value;
  const condition = document.getElementById('new-condition').value;
  const listingType = document.getElementById('new-type').value;
  const desc = document.getElementById('new-desc').value;

  if (!title || !price || !desc) {
    showToast('Please fill in all required fields', '⚠️');
    return;
  }

  const newListing = {
    id: 'new_' + Date.now(),
    sellerId: 'me',
    seller: CURRENT_USER,
    title, description: desc, price,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&fit=crop'],
    category, condition, status: 'available',
    listingType, zone,
    likes: 0, comments: 0, shares: 0, isLiked: false, isSaved: false,
    createdAt: 'Just now', location: 'Port Harcourt', escrowEnabled: true,
    priceScout: { score: 'Fair', marketMin: price * 0.9, marketMax: price * 1.2, analysis: 'Newly listed. Price Scout will analyse this listing shortly.' }
  };

  MOCK_LISTINGS.unshift(newListing);
  closeModal('create-listing-modal');
  renderFeed();
  showToast('Listing posted successfully!', '🎉');
  e.target.reset();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderFxTicker();
  renderStories();
  renderZones();
  renderFeatureRow();
  renderCatBar('cat-bar-feed');
  renderFeed();
  navigate('feed');

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }

  // Create listing form
  const createForm = document.getElementById('create-listing-form');
  if (createForm) createForm.addEventListener('submit', submitListing);

  // Checkout form
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) checkoutForm.addEventListener('submit', (e) => { e.preventDefault(); placeOrder(); });
});
