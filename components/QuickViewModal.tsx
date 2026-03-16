'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Check } from 'lucide-react';
import { useStore } from '@/store/use-store';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, enquiry, addToEnquiry, removeFromEnquiry, addViewedProduct } = useStore();

  useEffect(() => {
    if (quickViewProduct) {
      addViewedProduct(quickViewProduct);
    }
  }, [quickViewProduct, addViewedProduct]);

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <div key="quick-view" className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => setQuickViewProduct(null)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ ease: [0.34, 1.15, 0.64, 1], duration: 0.4 }}
            className="glass-panel w-full max-w-sm rounded-3xl p-6 pointer-events-auto relative border border-white/10 shadow-2xl"
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="aspect-square w-full bg-white/5 rounded-2xl mb-6 overflow-hidden relative">
              <Image
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 24rem"
              />
            </div>

            <div className="mb-6">
              <h3 className="font-serif text-2xl mb-1">{quickViewProduct.name}</h3>
              <p className="font-mono text-sm text-white/60">
                {quickViewProduct.variants[0].storage} • ₦{quickViewProduct.variants[0].price.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => {
                const defaultVariant = quickViewProduct.variants[0];
                const isAdded = enquiry.some((item) => item.variant.id === defaultVariant.id);
                if (isAdded) {
                  removeFromEnquiry(defaultVariant.id);
                } else {
                  addToEnquiry(quickViewProduct, defaultVariant);
                }
              }}
              disabled={quickViewProduct.variants[0].status === 'out-of-stock'}
              className={`w-full py-4 rounded-xl font-sans font-medium flex items-center justify-center gap-2 transition-colors ${
                enquiry.some((item) => item.variant.id === quickViewProduct.variants[0].id)
                  ? 'bg-white/10 text-white'
                  : quickViewProduct.variants[0].status === 'out-of-stock'
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-[#c8692c] text-white hover:bg-[#d97a3d]'
              }`}
            >
              {enquiry.some((item) => item.variant.id === quickViewProduct.variants[0].id) ? (
                <>
                  <Check size={18} /> Added to Enquiry
                </>
              ) : (
                <>
                  <Plus size={18} /> Add to Enquiry
                </>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
