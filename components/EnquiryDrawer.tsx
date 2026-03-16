'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, CreditCard, FileText } from 'lucide-react';
import { useStore } from '@/store/use-store';
import jsPDF from 'jspdf';

export default function EnquiryDrawer() {
  const { isEnquiryDrawerOpen, setEnquiryDrawerOpen, enquiry, removeFromEnquiry, updateEnquiryQuantity, clearEnquiry, setOrderTrackerOpen, setHasPaid } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const totalPrice = enquiry.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.text('TheMerchant', 20, 20);
    
    doc.setFontSize(10);
    doc.text('Invoice #TM-2026-8942', 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Customer Info
    doc.text('Billed To:', 20, 50);
    doc.setFontSize(12);
    doc.text('Maro E.', 20, 55);
    doc.setFontSize(10);
    doc.text('maro@example.com', 20, 60);
    
    // Items
    let yPos = 80;
    doc.setFontSize(12);
    doc.text('Item', 20, yPos);
    doc.text('Qty', 140, yPos);
    doc.text('Price', 170, yPos);
    
    doc.line(20, yPos + 2, 190, yPos + 2);
    yPos += 10;
    
    doc.setFontSize(10);
    enquiry.forEach((item) => {
      doc.text(`${item.product.name} (${item.variant.storage})`, 20, yPos);
      doc.text(item.quantity.toString(), 140, yPos);
      doc.text(`NGN ${item.variant.price.toLocaleString()}`, 170, yPos);
      yPos += 10;
    });
    
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    // Total
    doc.setFontSize(14);
    doc.text('Total:', 140, yPos);
    doc.text(`NGN ${totalPrice.toLocaleString()}`, 170, yPos);
    
    doc.save('TheMerchant_Invoice.pdf');
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    
    // Simulate Paystack iframe / Webhook verification
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentSuccess(true);
    setHasPaid(true);
    
    // Generate PDF
    generatePDF();
    
    // Wait a bit, then close drawer, clear cart, and open tracker
    setTimeout(() => {
      setPaymentSuccess(false);
      setEnquiryDrawerOpen(false);
      clearEnquiry();
      setOrderTrackerOpen(true);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isEnquiryDrawerOpen && (
        <div key="enquiry-drawer" className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => !isProcessing && setEnquiryDrawerOpen(false)}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ease: [0.34, 1.15, 0.64, 1], duration: 0.5 }}
            className="glass-panel w-full max-w-md h-full pointer-events-auto flex flex-col border-l border-white/10 relative z-10"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-serif text-2xl">Your Enquiry</h2>
              <button
                onClick={() => setEnquiryDrawerOpen(false)}
                disabled={isProcessing}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
              {enquiry.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/50">
                  <FileText size={48} className="mb-4 opacity-20" />
                  <p className="font-sans">Your enquiry is empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiry.map((item) => (
                    <div key={item.variant.id} className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div className="w-20 h-20 rounded-xl bg-white/5 overflow-hidden shrink-0 relative">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="5rem" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-lg leading-tight mb-1">{item.product.name}</h3>
                          <p className="font-mono text-xs text-white/50">{item.variant.storage}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="font-mono text-sm font-medium">₦{item.variant.price.toLocaleString()}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                              <button
                                onClick={() => updateEnquiryQuantity(item.variant.id, item.quantity - 1)}
                                disabled={isProcessing || item.quantity <= 1}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-50 transition-colors text-white/70"
                              >
                                -
                              </button>
                              <span className="font-mono text-xs w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateEnquiryQuantity(item.variant.id, item.quantity + 1)}
                                disabled={isProcessing}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-50 transition-colors text-white/70"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromEnquiry(item.variant.id)}
                              disabled={isProcessing}
                              className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {enquiry.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#0d0d0d]/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-white/60">Total</span>
                  <span className="font-mono text-2xl font-medium">₦{totalPrice.toLocaleString()}</span>
                </div>
                
                <button
                  onClick={handlePayNow}
                  disabled={isProcessing || paymentSuccess}
                  className={`w-full py-4 rounded-xl font-sans font-medium flex items-center justify-center gap-2 transition-colors ${
                    paymentSuccess
                      ? 'bg-green-500 text-white'
                      : 'bg-[#c8692c] text-white hover:bg-[#d97a3d]'
                  } disabled:opacity-80`}
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : paymentSuccess ? (
                    'Payment Successful!'
                  ) : (
                    <>
                      <CreditCard size={18} /> Pay Now
                    </>
                  )}
                </button>
                {paymentSuccess && (
                  <p className="text-center text-xs text-green-400 mt-3 font-mono">
                    Generating invoice...
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
