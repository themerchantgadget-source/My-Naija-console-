'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useStore } from '@/store/use-store';
import { User, Package, Map, Settings, LogOut, ChevronRight, Heart, Sparkles, Github, Trash2, Plus, Navigation } from 'lucide-react';

const DELIVERY_ZONES = [
  { name: 'Port Harcourt CBD', status: 'Live', avgTime: '1.5 hrs' },
  { name: 'GRA Phase 1 & 2', status: 'Live', avgTime: '2.0 hrs' },
  { name: 'Choba/UniPort', status: 'Live', avgTime: '3.5 hrs' },
  { name: 'Trans-Amadi', status: 'Live', avgTime: '2.2 hrs' },
  { name: 'Rumuola/Rumuokoro', status: 'Live', avgTime: '2.8 hrs' },
  { name: 'D/Line', status: 'Live', avgTime: '1.8 hrs' },
  { name: 'Eleme/Oyigbo', status: 'Live', avgTime: '4.5 hrs' },
];

export default function ProfileTab() {
  const { setOrderTrackerOpen, wishlist, removeFromWishlist, addToEnquiry, setAiModalOpen, setMapsModalOpen, setSearchModalOpen, userProfile, setSettingsModalOpen } = useStore();

  const handlePublishToGithub = () => {
    alert("Ready for deployment. Use the AI Studio 'Export to GitHub' feature in the top right menu to publish this codebase.");
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar pb-32">
      <header className="px-6 pt-16 pb-8 border-b border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 overflow-hidden border border-white/10 relative">
            {userProfile.avatar ? (
              <Image src={userProfile.avatar} alt={userProfile.name} fill className="object-cover" sizes="4rem" />
            ) : (
              <span className="font-serif text-2xl">{getInitials(userProfile.name)}</span>
            )}
          </div>
          <div>
            <h1 className="font-serif text-3xl">{userProfile.name}</h1>
            <p className="font-mono text-sm text-white/50">{userProfile.email}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setSettingsModalOpen(true)}
            className="flex-1 bg-white/5 border border-white/10 py-2 rounded-full font-sans text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Edit Profile
          </button>
          <button 
            onClick={() => setSettingsModalOpen(true)}
            className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="px-6 py-8 space-y-8">
        {/* AI & Developer Tools */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-white/50 mb-4">Tools & Integrations</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setAiModalOpen(true)}
              className="w-full glass-panel p-4 rounded-2xl border border-[#c8692c]/30 flex items-center justify-between hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c8692c]/20 flex items-center justify-center text-[#c8692c]">
                  <Sparkles size={18} />
                </div>
                <div className="text-left">
                  <p className="font-sans text-sm font-medium">AI Analysis Studio</p>
                  <p className="font-mono text-[10px] text-white/50">Analyze images & video content</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/30 group-hover:text-white/70 transition-colors" />
            </button>

            <button 
              onClick={() => setMapsModalOpen(true)}
              className="w-full glass-panel p-4 rounded-2xl border border-blue-500/30 flex items-center justify-between hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Navigation size={18} />
                </div>
                <div className="text-left">
                  <p className="font-sans text-sm font-medium">Location & Maps Agent</p>
                  <p className="font-mono text-[10px] text-white/50">Find places & directions</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/30 group-hover:text-white/70 transition-colors" />
            </button>

            <button 
              onClick={() => setSearchModalOpen(true)}
              className="w-full glass-panel p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles size={18} />
                </div>
                <div className="text-left">
                  <p className="font-sans text-sm font-medium">Fast Search Agent</p>
                  <p className="font-mono text-[10px] text-white/50">Real-time web & fact-check</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/30 group-hover:text-white/70 transition-colors" />
            </button>

            <button 
              onClick={handlePublishToGithub}
              className="w-full glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                  <Github size={18} />
                </div>
                <div className="text-left">
                  <p className="font-sans text-sm font-medium">Publish to GitHub</p>
                  <p className="font-mono text-[10px] text-white/50">Export full codebase</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/30 group-hover:text-white/70 transition-colors" />
            </button>
          </div>
        </section>

        {/* Wishlist */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans text-xs uppercase tracking-widest text-white/50">My Wishlist</h2>
            <span className="font-mono text-[10px] text-white/30">{wishlist.length} Items</span>
          </div>
          
          {wishlist.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center">
              <Heart size={24} className="mx-auto text-white/20 mb-3" />
              <p className="font-sans text-sm text-white/50">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlist.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel p-3 rounded-2xl border border-white/10 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0 relative">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="3rem" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-lg truncate">{product.name}</h4>
                    <p className="font-mono text-[10px] text-[#c8692c]">From ₦{product.variants[0].price.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => addToEnquiry(product, product.variants[0])}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      title="Add default variant to Enquiry"
                    >
                      <Plus size={14} />
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(product.id)}
                      className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Active Orders */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-white/50 mb-4">Active Orders</h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setOrderTrackerOpen(true)}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-[#c8692c]" />
                <span className="font-mono text-sm font-medium">#TM-2026-8942</span>
              </div>
              <span className="font-sans text-xs text-[#c8692c] bg-[#c8692c]/10 px-2 py-1 rounded-md">In Transit</span>
            </div>
            <p className="font-serif text-lg mb-1">MacBook Pro M4 Max</p>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
              <span className="font-mono text-xs text-white/50">Est. Arrival: 14:30</span>
              <span className="font-sans text-xs font-medium flex items-center gap-1 text-white/80">
                Track Order <ChevronRight size={14} />
              </span>
            </div>
          </motion.div>
        </section>

        {/* Delivery Network Console */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Map size={16} className="text-white/50" />
            <h2 className="font-sans text-xs uppercase tracking-widest text-white/50">Delivery Network Console</h2>
          </div>
          
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <span className="font-serif text-xl">Rivers State</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="font-mono text-xs text-green-400 uppercase">Operational</span>
              </div>
            </div>
            
            <div className="divide-y divide-white/5">
              {DELIVERY_ZONES.map((zone, i) => (
                <div key={i} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                  <span className="font-sans text-sm">{zone.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-white/50">{zone.avgTime}</span>
                    <span className="font-sans text-[10px] uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                      {zone.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logout */}
        <button className="w-full py-4 rounded-2xl border border-red-500/20 text-red-400 font-sans text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
