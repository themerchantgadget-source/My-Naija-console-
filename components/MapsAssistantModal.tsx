'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/use-store';
import { X, MapPin, Sparkles, Loader2, ExternalLink, Navigation } from 'lucide-react';
import { GoogleGenAI, GenerateContentParameters } from '@google/genai';
import Markdown from 'react-markdown';

export default function MapsAssistantModal() {
  const { isMapsModalOpen, setMapsModalOpen, hasPaid } = useStore();
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [links, setLinks] = useState<{uri: string, title: string}[]>([]);

  const handleClose = () => {
    setMapsModalOpen(false);
    setTimeout(() => {
      setPrompt('');
      setResult(null);
      setLinks([]);
      setIsAnalyzing(false);
    }, 300);
  };

  const handleSearch = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setLinks([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      let latLng = undefined;
      
      if (hasPaid && typeof navigator !== 'undefined' && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          latLng = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (e) {
          console.log("Geolocation not available or denied.", e);
        }
      }

      const config: GenerateContentParameters['config'] = {
        tools: [{ googleMaps: {} }],
      };

      if (latLng) {
        config.toolConfig = {
          retrievalConfig: {
            latLng
          }
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config
      });

      setResult(response.text || 'No information found.');
      
      // Extract URLs from grounding metadata
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const extractedLinks: {uri: string, title: string}[] = [];
      
      if (chunks) {
        chunks.forEach((chunk) => {
          if (chunk.maps?.uri) {
            extractedLinks.push({
              uri: chunk.maps.uri,
              title: chunk.maps.title || 'View on Google Maps'
            });
          }
        });
      }
      
      // Deduplicate links
      const uniqueLinks = Array.from(new Map(extractedLinks.map(item => [item.uri, item])).values());
      setLinks(uniqueLinks);

    } catch (error) {
      console.error('Maps error:', error);
      setResult('An error occurred while fetching maps data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AnimatePresence>
      {isMapsModalOpen && (
        <div key="maps-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#101012] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl">Location & Maps Agent</h2>
                  <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Powered by Google Maps</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6">
              
              <div className="space-y-2">
                <label className="font-mono text-xs text-white/40 uppercase tracking-widest pl-1">Ask about places or directions</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Where is the nearest Apple store? or How do I get from GRA Phase 2 to Trans-Amadi?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-sans focus:outline-none focus:border-blue-500/50 min-h-[100px] resize-none"
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={isAnalyzing || !prompt.trim()}
                className="w-full py-4 bg-blue-600 text-white font-mono text-xs uppercase tracking-wider rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Searching Maps...
                  </>
                ) : (
                  <>
                    <Navigation size={16} /> Find Location
                  </>
                )}
              </button>

              {/* Results */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white/5 border border-blue-500/30 rounded-2xl space-y-4"
                  >
                    <h3 className="font-mono text-xs text-blue-400 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={14} /> Agent Response
                    </h3>
                    <div className="prose prose-invert prose-sm max-w-none font-sans text-white/80">
                      <Markdown>{result}</Markdown>
                    </div>

                    {links.length > 0 && (
                      <div className="pt-4 border-t border-white/10 space-y-3">
                        <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Map Links</h4>
                        <div className="flex flex-col gap-2">
                          {links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
                            >
                              <span className="font-sans text-sm text-white/90 truncate pr-4">{link.title}</span>
                              <ExternalLink size={14} className="text-white/40 group-hover:text-blue-400 flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
