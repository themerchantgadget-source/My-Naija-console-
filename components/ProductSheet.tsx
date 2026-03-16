'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation, useDragControls } from 'motion/react';
import { X, Check, Plus, Heart, Star, MessageSquare } from 'lucide-react';
import { useStore, ProductVariant } from '@/store/use-store';

export default function ProductSheet() {
  const { activeProduct, setActiveProduct, enquiry, addToEnquiry, removeFromEnquiry, wishlist, addToWishlist, removeFromWishlist, reviews, addReview, addViewedProduct } = useStore();
  const controls = useAnimation();
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isWritingReview, setIsWritingReview] = useState(false);

  useEffect(() => {
    if (activeProduct) {
      controls.start({ y: 0 });
      document.body.style.overflow = 'hidden';
      addViewedProduct(activeProduct);
    } else {
      document.body.style.overflow = '';
    }
  }, [activeProduct, controls, addViewedProduct]);

  const handleClose = () => {
    setActiveProduct(null);
    setIsWritingReview(false);
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 80 || info.velocity.y > 500) {
      handleClose();
    } else {
      controls.start({ y: 0, transition: { ease: [0.34, 1.15, 0.64, 1], duration: 0.5 } });
    }
  };

  const handleAddReview = () => {
    if (!activeProduct || !reviewText.trim()) return;
    addReview(activeProduct.id, {
      id: Math.random().toString(36).substr(2, 9),
      userName: 'Current User', // Mock user
      rating: reviewRating,
      text: reviewText,
      date: new Date().toISOString().split('T')[0]
    });
    setReviewText('');
    setIsWritingReview(false);
  };

  if (!activeProduct) return null;

  const isWishlisted = wishlist.some(p => p.id === activeProduct.id);
  const productReviews = reviews[activeProduct.id] || [];
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((acc, rev) => acc + rev.rating, 0) / productReviews.length).toFixed(1)
    : null;

  return (
    <AnimatePresence>
      {activeProduct && (
        <div key="product-sheet" className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={handleClose}
          />
          
          <motion.div
            ref={sheetRef}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ ease: [0.34, 1.15, 0.64, 1], duration: 0.5 }}
            className="glass-panel w-full max-w-2xl h-[90vh] rounded-t-3xl pointer-events-auto flex flex-col overflow-hidden border-t border-white/10"
          >
            {/* Drag Handle */}
            <div
              className="w-full h-12 flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-24">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-mono text-[10px] text-[#c8692c] uppercase tracking-wider">
                      {activeProduct.category}
                    </p>
                    {avgRating && (
                      <div className="flex items-center gap-0.5 text-yellow-500">
                        <Star size={10} fill="currentColor" />
                        <span className="font-mono text-[10px]">{avgRating} ({productReviews.length})</span>
                      </div>
                    )}
                  </div>
                  <h2 className="font-serif text-4xl mb-2">{activeProduct.name}</h2>
                  <p className="font-sans text-white/60 text-sm">{activeProduct.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => isWishlisted ? removeFromWishlist(activeProduct.id) : addToWishlist(activeProduct)}
                    className={`p-2 rounded-full transition-colors ${
                      isWishlisted ? 'bg-red-500/10 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="aspect-video w-full bg-white/5 rounded-2xl mb-8 overflow-hidden relative">
                <Image
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 42rem"
                />
              </div>

              <div className="space-y-3 mb-10">
                <h3 className="font-sans text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                  Select Variant
                </h3>
                {activeProduct.variants.map((variant, index) => {
                  const isAdded = enquiry.some((item) => item.variant.id === variant.id);
                  
                  return (
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.038, ease: [0.34, 1.15, 0.64, 1] }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            variant.status === 'in-stock'
                              ? 'bg-green-500'
                              : variant.status === 'low-stock'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span className="font-mono text-sm">{variant.storage}</span>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <span className="font-mono text-sm">₦{variant.price.toLocaleString()}</span>
                        <button
                          onClick={() => {
                            if (isAdded) {
                              removeFromEnquiry(variant.id);
                            } else {
                              addToEnquiry(activeProduct, variant);
                            }
                          }}
                          disabled={variant.status === 'out-of-stock'}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isAdded
                              ? 'bg-[#c8692c] text-white'
                              : variant.status === 'out-of-stock'
                              ? 'bg-white/5 text-white/20 cursor-not-allowed'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {isAdded ? <Check size={16} /> : <Plus size={16} />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Reviews Section */}
              <div className="pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-sans text-sm font-medium text-white/40 uppercase tracking-wider">Reviews & Ratings</h3>
                  <button 
                    onClick={() => setIsWritingReview(!isWritingReview)}
                    className="text-xs font-mono text-[#c8692c] flex items-center gap-1 hover:text-[#e07a36] transition-colors"
                  >
                    <MessageSquare size={12} />
                    {isWritingReview ? 'Cancel' : 'Write a Review'}
                  </button>
                </div>

                <AnimatePresence>
                  {isWritingReview && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 overflow-hidden"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-white/60">Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} onClick={() => setReviewRating(star)} className="text-yellow-500 hover:scale-110 transition-transform">
                                <Star size={18} fill={star <= reviewRating ? "currentColor" : "none"} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea 
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your experience with this product..."
                          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm font-sans focus:outline-none focus:border-[#c8692c]/50 min-h-[100px] resize-none"
                        />
                        <button 
                          onClick={handleAddReview}
                          disabled={!reviewText.trim()}
                          className="w-full py-3 bg-white text-black font-mono text-xs uppercase tracking-wider rounded-xl hover:bg-white/90 disabled:opacity-50 transition-colors"
                        >
                          Submit Review
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  {productReviews.length === 0 ? (
                    <p className="text-sm text-white/40 font-sans italic">No reviews yet. Be the first to review!</p>
                  ) : (
                    productReviews.map((review) => (
                      <div key={review.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs text-white/80">{review.userName}</span>
                          <span className="font-mono text-[10px] text-white/40">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-yellow-500 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <p className="text-sm font-sans text-white/70 leading-relaxed">{review.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
