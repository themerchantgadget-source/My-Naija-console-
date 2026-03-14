'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Navigation } from 'lucide-react';
import { useStore } from '@/store/use-store';

export default function OrderTracker() {
  const { isOrderTrackerOpen, setOrderTrackerOpen } = useStore();

  return (
    <AnimatePresence>
      {isOrderTrackerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0d0d0d] pointer-events-auto"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ ease: [0.34, 1.15, 0.64, 1], duration: 0.5 }}
            className="absolute inset-0 pointer-events-auto flex flex-col"
          >
            {/* Header */}
            <div className="glass-panel px-6 py-4 flex justify-between items-center border-b border-white/10 z-10">
              <div>
                <h2 className="font-serif text-2xl">Order Tracker</h2>
                <p className="font-mono text-xs text-white/60">ID: #TM-2026-8942</p>
              </div>
              <button
                onClick={() => setOrderTrackerOpen(false)}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative overflow-hidden bg-[#1a1a1a]">
              {/* Abstract SVG Map */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
                <path d="M100,100 L900,100 L900,900 L100,900 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 10" />
                <path d="M200,0 L200,1000 M400,0 L400,1000 M600,0 L600,1000 M800,0 L800,1000" stroke="white" strokeWidth="1" />
                <path d="M0,200 L1000,200 M0,400 L1000,400 M0,600 L1000,600 M0,800 L1000,800" stroke="white" strokeWidth="1" />
                {/* Route Line */}
                <motion.path
                  d="M200,800 C300,800 400,600 600,600 C700,600 800,400 800,200"
                  fill="none"
                  stroke="#c8692c"
                  strokeWidth="4"
                  strokeDasharray="10 10"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </svg>

              {/* Pulsing Rider Dot */}
              <motion.div
                className="absolute w-6 h-6 bg-[#c8692c] rounded-full shadow-[0_0_20px_#c8692c] flex items-center justify-center"
                initial={{ left: '20%', top: '80%', x: '-50%', y: '-50%' }}
                animate={{ left: '60%', top: '60%', x: '-50%', y: '-50%' }}
                transition={{ duration: 3, ease: "easeInOut" }}
              >
                <Navigation size={12} className="text-white fill-white" />
                <motion.div
                  className="absolute inset-0 border-2 border-[#c8692c] rounded-full"
                  animate={{ scale: [1, 2], opacity: [1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>

              {/* Destination Pin */}
              <div className="absolute left-[80%] top-[20%] -translate-x-1/2 -translate-y-full text-white">
                <MapPin size={32} className="text-white fill-white/20" />
              </div>
            </div>

            {/* Status Panel */}
            <div className="glass-panel p-6 border-t border-white/10 z-10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="font-sans text-sm text-white/60 mb-1">Estimated Arrival</p>
                  <p className="font-mono text-3xl">14:30</p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-sm text-white/60 mb-1">Status</p>
                  <p className="font-sans text-lg text-[#c8692c] font-medium">In Transit</p>
                </div>
              </div>
              
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#c8692c]"
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
