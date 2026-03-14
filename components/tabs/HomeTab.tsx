'use client';

import { motion } from 'motion/react';
import { useStore, Product } from '@/store/use-store';
import { Activity, Clock, Package, TrendingUp } from 'lucide-react';

const MOCK_PRODUCTS: Product[] = [
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
];

export default function HomeTab() {
  const { setActiveProduct } = useStore();

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar pb-32">
      {/* Header */}
      <header className="px-6 pt-16 pb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-serif text-4xl">Good morning, Maro</h1>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="font-mono text-xs text-white/80">5G LIVE</span>
          </div>
        </div>
        <p className="font-sans text-white/50 text-sm">Port Harcourt CBD • Rivers State</p>
      </header>

      {/* 4-Metric Stat Strip */}
      <div className="px-6 mb-12">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-white/50 mb-2">
              <TrendingUp size={14} />
              <span className="font-sans text-xs uppercase tracking-wider">Top Price</span>
            </div>
            <p className="font-mono text-lg">₦2.15M</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-white/50 mb-2">
              <Package size={14} />
              <span className="font-sans text-xs uppercase tracking-wider">Stock</span>
            </div>
            <p className="font-mono text-lg">1,204</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-white/50 mb-2">
              <Clock size={14} />
              <span className="font-sans text-xs uppercase tracking-wider">Avg Delivery</span>
            </div>
            <p className="font-mono text-lg">3.2 hrs</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-white/50 mb-2">
              <Activity size={14} />
              <span className="font-sans text-xs uppercase tracking-wider">Network</span>
            </div>
            <p className="font-mono text-lg text-green-400">Optimal</p>
          </div>
        </div>
      </div>

      {/* Lineup Section */}
      <section className="mb-12">
        <div className="px-6 mb-6 flex items-end justify-between">
          <h2 className="font-serif text-3xl">The Lineup</h2>
          <button className="font-sans text-xs text-[#c8692c] uppercase tracking-wider hover:underline">
            View All
          </button>
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar px-6 gap-4 snap-x snap-mandatory">
          {MOCK_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, ease: [0.34, 1.15, 0.64, 1] }}
              className="min-w-[280px] w-[280px] snap-center cursor-pointer"
              onClick={() => setActiveProduct(product)}
            >
              <div className="aspect-[4/5] bg-white/5 rounded-3xl overflow-hidden relative mb-4 border border-white/10 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-mono text-xs text-white/60 mb-1">{product.category}</p>
                  <h3 className="font-serif text-2xl leading-tight">{product.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Restoration & Repair Disciplines */}
      <section className="px-6 mb-12">
        <h2 className="font-serif text-3xl mb-6">Certified Repairs</h2>
        <div className="space-y-3">
          {['Screen Repair', 'Battery Replacement', 'Keyboard Restoration', 'Panel Restoration'].map((discipline, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl border border-white/10 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer">
              <span className="font-sans text-lg">{discipline}</span>
              <span className="font-mono text-xs text-[#c8692c] uppercase tracking-wider">Book</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
