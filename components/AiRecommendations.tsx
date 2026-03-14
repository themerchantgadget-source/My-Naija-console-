'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useStore } from '@/store/use-store';
import { GoogleGenAI, Type } from '@google/genai';

interface PremiumProduct {
  id: string;
  name: string;
  price: string;
  img: string;
  urgency: string;
  seller: string;
}

export default function AiRecommendations({ premiumProducts }: { premiumProducts: PremiumProduct[] }) {
  const { viewedProducts, userPreferences, setActiveProduct } = useStore();
  const [recommendations, setRecommendations] = useState<PremiumProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [reasoning, setReasoning] = useState<string>('');

  const handleProductClick = (item: PremiumProduct) => {
    setActiveProduct({
      id: item.id,
      name: item.name,
      category: 'Premium',
      description: 'Exclusive premium item recommended by AI.',
      image: 'https://picsum.photos/seed/' + item.id + '/800/600',
      variants: [
        { id: item.id + '-v1', storage: 'Standard', price: parseInt(item.price.replace(/[^0-9]/g, '')) || 50000, status: 'in-stock' }
      ],
      seller: item.seller,
      isVerified: true
    });
  };

  useEffect(() => {
    async function fetchRecommendations() {
      if (viewedProducts.length === 0 && userPreferences.length === 0) {
        // No history yet, just show top 2 premium products
        setRecommendations(premiumProducts.slice(0, 2));
        setReasoning("Trending premium picks for you.");
        return;
      }

      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
        
        const prompt = `
          You are an elite AI shopping assistant.
          User's recently viewed products: ${viewedProducts.map(p => p.name).join(', ') || 'None'}
          User's preferences: ${userPreferences.join(', ') || 'None'}
          
          Available Premium Products:
          ${JSON.stringify(premiumProducts, null, 2)}
          
          Task: Select the top 2 premium products that best match the user's profile.
          Provide a short, punchy 1-sentence reason for the recommendation.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recommendedIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Array of exactly 2 product IDs from the available list"
                },
                reasoning: {
                  type: Type.STRING,
                  description: "A short, punchy 1-sentence reason for these recommendations"
                }
              },
              required: ["recommendedIds", "reasoning"]
            }
          }
        });

        const result = JSON.parse(response.text || '{}');
        const recommendedIds = result.recommendedIds || [];
        
        const matchedProducts = premiumProducts.filter(p => recommendedIds.includes(p.id));
        
        if (matchedProducts.length > 0) {
          setRecommendations(matchedProducts);
          setReasoning(result.reasoning || "Curated based on your unique taste.");
        } else {
          setRecommendations(premiumProducts.slice(0, 2));
          setReasoning("Trending premium picks for you.");
        }
      } catch (error) {
        console.error("AI Recommendation Error:", error);
        setRecommendations(premiumProducts.slice(0, 2));
        setReasoning("Trending premium picks for you.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [viewedProducts, userPreferences, premiumProducts]);

  if (recommendations.length === 0 && !loading) return null;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Sparkles className="text-[#c8692c]" size={18} />
        <h2 className="font-serif text-xl text-white">AI Recommended</h2>
      </div>
      
      {loading ? (
        <div className="w-full h-[120px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
          <Loader2 className="animate-spin text-white/40" size={24} />
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#c8692c] px-2 mb-2">{reasoning}</p>
          <div className="grid grid-cols-2 gap-3 px-2">
            {recommendations.map((item, idx) => (
              <motion.div
                key={item.id}
                onClick={() => handleProductClick(item)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-gradient-to-br from-[#1a0b0b] to-[#050202] rounded-2xl border border-[#dc3c28]/30 overflow-hidden flex flex-col p-3 group cursor-pointer hover:border-[#dc3c28]/60 transition-colors"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#dc3c28]/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-start mb-2 z-10">
                  <span className="text-[9px] font-mono text-[#dc3c28] uppercase tracking-wider bg-[#dc3c28]/10 px-1.5 py-0.5 rounded">Premium</span>
                  <span className="text-3xl group-hover:scale-110 transition-transform">{item.img}</span>
                </div>
                <div className="mt-auto z-10">
                  <div className="text-[10px] text-white/50 font-sans truncate">{item.seller}</div>
                  <div className="text-xs font-bold text-white font-serif truncate">{item.name}</div>
                  <div className="text-[11px] font-black text-[#dc3c28] font-serif mt-1">{item.price}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
