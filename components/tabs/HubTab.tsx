'use client';

import { motion } from 'motion/react';
import { useStore, Product } from '@/store/use-store';
import { Search, SlidersHorizontal, Eye, Heart, Star } from 'lucide-react';

const MOCK_INVENTORY: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 17 Pro Max',
    category: 'Phones',
    description: 'The ultimate titanium experience with A19 Pro chip.',
    image: 'https://picsum.photos/seed/iphone17/800/800',
    variants: [
      { id: 'v1', storage: '256GB', price: 2150000, status: 'in-stock' },
      { id: 'v2', storage: '512GB', price: 2450000, status: 'low-stock' },
      { id: 'v3', storage: '1TB', price: 2850000, status: 'out-of-stock' },
    ],
  },
  {
    id: 'p2',
    name: 'MacBook Pro M4 Max',
    category: 'Laptops',
    description: 'Unprecedented performance for pro workflows.',
    image: 'https://picsum.photos/seed/macbookm4/800/800',
    variants: [
      { id: 'v4', storage: '1TB / 36GB', price: 5200000, status: 'in-stock' },
      { id: 'v5', storage: '2TB / 64GB', price: 6800000, status: 'in-stock' },
    ],
  },
  {
    id: 'p3',
    name: 'AirPods Pro (3rd Gen)',
    category: 'Audio',
    description: 'Next-level active noise cancellation.',
    image: 'https://picsum.photos/seed/airpods3/800/800',
    variants: [
      { id: 'v6', storage: 'Standard', price: 450000, status: 'in-stock' },
    ],
  },
  {
    id: 'p4',
    name: 'iPad Pro 13" M4',
    category: 'Tablets',
    description: 'Incredibly thin and light with OLED display.',
    image: 'https://picsum.photos/seed/ipadpro/800/800',
    variants: [
      { id: 'v7', storage: '256GB', price: 1850000, status: 'in-stock' },
      { id: 'v8', storage: '512GB', price: 2150000, status: 'in-stock' },
    ],
  },
  {
    id: 'p5',
    name: 'Apple Watch Ultra 3',
    category: 'Wearables',
    description: 'The most rugged and capable Apple Watch.',
    image: 'https://picsum.photos/seed/watchultra/800/800',
    variants: [
      { id: 'v9', storage: '49mm', price: 1250000, status: 'low-stock' },
    ],
  },
];

export default function HubTab() {
  const { setActiveProduct, setQuickViewProduct, wishlist, addToWishlist, removeFromWishlist, reviews } = useStore();

  const getAverageRating = (productId: string) => {
    const productReviews = reviews[productId];
    if (!productReviews || productReviews.length === 0) return null;
    const sum = productReviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar pb-32">
      <header className="px-6 pt-16 pb-6 sticky top-0 bg-[#0d0d0d]/80 backdrop-blur-xl z-20">
        <h1 className="font-serif text-4xl mb-6">The Hub</h1>
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm font-sans focus:outline-none focus:border-[#c8692c]/50 transition-colors"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </header>

      <div className="px-6 space-y-3">
        {MOCK_INVENTORY.map((product, index) => {
          const isWishlisted = wishlist.some((p) => p.id === product.id);
          const avgRating = getAverageRating(product.id);

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: index * 0.05, ease: [0.34, 1.15, 0.64, 1] }}
              className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors group relative"
              onClick={() => setActiveProduct(product)}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono text-[10px] text-[#c8692c] uppercase tracking-wider truncate">
                    {product.category}
                  </p>
                  {avgRating && (
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      <Star size={10} fill="currentColor" />
                      <span className="font-mono text-[10px]">{avgRating}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-serif text-xl truncate mb-1">{product.name}</h3>
                <p className="font-mono text-xs text-white/50 truncate">
                  From ₦{product.variants[0].price.toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isWishlisted ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct(product);
                  }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                  aria-label="Quick View"
                >
                  <Eye size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
