'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/use-store';

export default function EnquiryPill() {
  const { enquiry, setEnquiryDrawerOpen } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const totalItems = enquiry.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = enquiry.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ ease: [0.34, 1.15, 0.64, 1], duration: 0.5 }}
        className="fixed bottom-[120px] left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <button
          onClick={() => setEnquiryDrawerOpen(true)}
          className="glass-panel flex items-center gap-3 px-4 py-3 rounded-full border border-white/10 shadow-2xl hover:bg-white/5 transition-colors"
        >
          <div className="relative">
            <ShoppingBag size={20} className="text-[#c8692c]" />
            <span className="absolute -top-1 -right-1 bg-[#c8692c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium font-sans">Your Enquiry</span>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-white/60 font-mono"
              >
                ₦{totalPrice.toLocaleString()}
              </motion.span>
            )}
          </div>
          
          <ChevronRight size={16} className="text-white/40 ml-2" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
