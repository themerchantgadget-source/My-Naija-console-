'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Grid, MapPin, Crosshair, Lock, AlertCircle } from 'lucide-react';
import AiRecommendations from '@/components/AiRecommendations';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PREMIUM_PRODUCTS = [
  { id: 'p1', name: "Air Force 1 '07", price: "₦45,000", img: "👟", urgency: "🔥 3 PCS LEFT", seller: "Maro" },
  { id: 'p2', name: "PS5 Controller", price: "₦32,000", img: "🎮", urgency: "RUSH NOW!!", seller: "TechGadgets" },
  { id: 'p3', name: "Vintage Denim", price: "₦18,500", img: "🧥", urgency: "HOT DEAL!!", seller: "ThriftKing" },
  { id: 'p4', name: "Wireless Buds", price: "₦22,000", img: "🎧", urgency: "⚡ FLASH SALE", seller: "AudioHub" },
  { id: 'p5', name: "Rolex Submariner", price: "₦2.5M", img: "⌚", urgency: "VERIFIED AUTHENTIC", seller: "LuxeTime" },
  { id: 'p6', name: "MacBook Pro M3", price: "₦2.8M", img: "💻", urgency: "SEALED IN BOX", seller: "iStore NG" },
];

const STANDARD_PRODUCTS = [
  { id: 's1', name: "Leather Sneakers", price: "₦28,000", img: "👞", seller: "KicksNG" },
  { id: 's2', name: "Mechanical Keyboard", price: "₦45,000", img: "⌨️", seller: "TechGadgets" },
  { id: 's3', name: "Oversized Tee", price: "₦12,000", img: "👕", seller: "StreetWear" },
  { id: 's4', name: "Gaming Mouse", price: "₦15,000", img: "🖱️", seller: "PCMaster" },
];

export default function MarketplaceTab() {
  const [mode, setMode] = useState<'feed' | 'map'>('feed');
  const [locationGranted, setLocationGranted] = useState(false);
  const [premiumItems, setPremiumItems] = useState(PREMIUM_PRODUCTS);

  // 10-second reshuffle logic for the Premium Orbit
  useEffect(() => {
    if (mode !== 'feed') return;
    const interval = setInterval(() => {
      setPremiumItems(prev => {
        const shuffled = [...prev];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="h-full w-full flex flex-col bg-[#050505] relative overflow-hidden">
      {/* Header & Mode Toggle */}
      <div className="absolute top-0 left-0 w-full z-50 px-6 pt-14 pb-4 flex justify-between items-center bg-gradient-to-b from-[#050505] to-transparent pointer-events-none">
        <h1 className="font-serif text-3xl text-white tracking-tight pointer-events-auto">Market</h1>
        <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-full border border-white/10 pointer-events-auto">
          <button
            onClick={() => setMode('feed')}
            className={`p-2 rounded-full transition-all ${mode === 'feed' ? 'bg-white/15 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setMode('map')}
            className={`p-2 rounded-full transition-all ${mode === 'map' ? 'bg-white/15 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
          >
            <MapIcon size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full h-full relative pt-28 pb-24 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <AnimatePresence mode="wait">
          {mode === 'feed' ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="px-4 flex flex-col gap-8 h-full"
            >
              <AiRecommendations premiumProducts={PREMIUM_PRODUCTS} />

              {/* The Premium Orbit (Top 50%) */}
              <div className="relative w-full h-[45vh] min-h-[380px] rounded-[32px] bg-gradient-to-br from-[#1a0b0b]/90 via-[#0f0505]/95 to-[#050202]/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_60px_rgba(220,60,40,0.15)] overflow-hidden flex flex-col">
                {/* Floating Glow Effect */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#dc3c28]/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#dc3c28]/10 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="px-6 pt-5 pb-3 flex justify-between items-center z-10">
                  <span className="font-serif text-sm text-white/80 tracking-widest uppercase">Premium Orbit</span>
                  <span className="text-[10px] font-mono text-[#dc3c28] bg-[#dc3c28]/10 px-2 py-1 rounded-full border border-[#dc3c28]/20">LIVE</span>
                </div>

                <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-3 p-4 pt-0 z-10">
                  {premiumItems.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="relative bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center group cursor-pointer hover:bg-black/60 hover:border-white/15 transition-colors"
                    >
                      {/* Urgency Engine */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff3333] animate-pulse shadow-[0_0_8px_rgba(255,51,51,0.8)]" />
                        <div className="backdrop-blur-md bg-black/60 border border-white/10 text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded text-white/90 animate-[pulse_2s_ease-in-out_infinite]">
                          {item.urgency}
                        </div>
                      </div>
                      
                      {/* Product Visual */}
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-500">{item.img}</div>
                      
                      {/* Gradient Overlay & Text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                        <div className="truncate pr-2">
                          <div className="text-[9px] text-white/50 font-sans truncate">{item.seller}</div>
                          <div className="text-[11px] font-bold text-white font-serif truncate">{item.name}</div>
                        </div>
                        <div className="text-[10px] font-black text-[#dc3c28] font-serif">{item.price}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* The Swipe Matrix (Bottom 50%) */}
              <div className="flex-1 flex flex-col">
                <div className="px-2 mb-4 flex justify-between items-end">
                  <h2 className="font-serif text-xl text-white">Discover</h2>
                  <span className="text-xs text-white/40 font-sans">Swipe to explore →</span>
                </div>
                
                {/* Horizontal Swipe Carousel */}
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-2">
                  {STANDARD_PRODUCTS.map((item) => (
                    <div 
                      key={item.id} 
                      className="snap-center shrink-0 w-[240px] h-[300px] bg-[#0a0a0a] rounded-[24px] border border-white/5 p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs border border-white/10">{item.seller.charAt(0)}</div>
                        <div className="text-xs font-serif font-bold text-white/40">{item.price}</div>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500">
                        {item.img}
                      </div>
                      <div>
                        <div className="text-sm text-white/50 mb-1">{item.seller}</div>
                        <div className="font-serif text-lg text-white leading-tight">{item.name}</div>
                      </div>
                    </div>
                  ))}
                  {/* Spacer for end of scroll */}
                  <div className="shrink-0 w-4" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Simulated Map Background */}
              <div className="absolute inset-0 bg-[#080808] opacity-50" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              {!locationGranted ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
                  <div className="bg-[#0f0a0a] border border-white/10 rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#dc3c28] to-transparent opacity-50" />
                    <div className="w-16 h-16 rounded-full bg-[#dc3c28]/10 border border-[#dc3c28]/20 flex items-center justify-center mx-auto mb-6">
                      <Lock className="text-[#dc3c28]" size={28} />
                    </div>
                    <h3 className="font-serif text-2xl text-white mb-3">Cartographic Truth</h3>
                    <p className="text-sm text-white/50 mb-8 leading-relaxed">
                      To protect our ecosystem from spoofing and bad actors, the interactive map requires absolute fidelity. We use advanced network parsing to verify your precise location.
                    </p>
                    <button 
                      onClick={() => setLocationGranted(true)}
                      className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                    >
                      <Crosshair size={16} />
                      Grant Precise Location
                    </button>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 z-10">
                  {/* Floating Map Markers */}
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="absolute top-[30%] left-[20%] flex flex-col items-center cursor-pointer group"
                  >
                    <div className="bg-[#0f0a0a] border border-[#dc3c28]/50 rounded-xl p-2 shadow-lg mb-2 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">👟</span>
                    </div>
                    <div className="w-3 h-3 bg-[#dc3c28] rounded-full shadow-[0_0_12px_#dc3c28] animate-bounce" />
                  </motion.div>

                  <motion.div 
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    className="absolute top-[50%] right-[25%] flex flex-col items-center cursor-pointer group"
                  >
                    <div className="bg-[#0f0a0a] border border-white/20 rounded-xl p-2 shadow-lg mb-2 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🎮</span>
                    </div>
                    <div className="w-3 h-3 bg-white/80 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.5)] animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </motion.div>

                  {/* UI Overlay for Map */}
                  <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-[#0f0a0a]/90 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-white/70 uppercase tracking-widest">Location Verified</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
