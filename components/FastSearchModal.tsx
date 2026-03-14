'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/use-store';
import { X, Globe, Zap, ExternalLink, Loader2, Send } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'agent';
  text: string;
  links?: { uri: string; title: string }[];
}

export default function FastSearchModal() {
  const { isSearchModalOpen, setSearchModalOpen } = useStore();
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClose = () => {
    setSearchModalOpen(false);
    // Keep history for a bit, but clear if needed
  };

  const handleSearch = async () => {
    if (!prompt.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: prompt.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsAnalyzing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.1-flash-lite-preview',
        contents: userMessage.text,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      const agentMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: agentMessageId, role: 'agent', text: '' }]);

      let fullText = '';
      const extractedLinks: {uri: string, title: string}[] = [];

      for await (const chunk of responseStream) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = chunk as any;
        
        if (c.text) {
          fullText += c.text;
          setMessages(prev => prev.map(msg => 
            msg.id === agentMessageId ? { ...msg, text: fullText } : msg
          ));
        }

        if (c.groundingMetadata?.groundingChunks) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          c.groundingMetadata.groundingChunks.forEach((gChunk: any) => {
            if (gChunk.web?.uri) {
              extractedLinks.push({
                uri: gChunk.web.uri,
                title: gChunk.web.title || 'Source'
              });
            }
          });
        }
      }

      // Deduplicate links
      const uniqueLinks = Array.from(new Map(extractedLinks.map(item => [item.uri, item])).values());
      
      if (uniqueLinks.length > 0) {
        setMessages(prev => prev.map(msg => 
          msg.id === agentMessageId ? { ...msg, links: uniqueLinks } : msg
        ));
      }

    } catch (error) {
      console.error('Search error:', error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'agent', 
        text: 'An error occurred while fetching search data. Please try again.' 
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AnimatePresence>
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-2xl bg-[#101012] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[85vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Zap size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl">Fast Search Agent</h2>
                  <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider flex items-center gap-1">
                    Powered by Flash-Lite <Globe size={10} />
                  </p>
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
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <Globe size={48} className="text-emerald-400/50" />
                  <p className="font-sans text-sm max-w-xs">
                    Ask me about current events, fact-check information, or get instant answers grounded in real-time Google Search.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-emerald-600/20 border border-emerald-500/30 text-white' : 'bg-white/5 border border-white/10'}`}>
                        {msg.role === 'agent' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Zap size={14} className="text-emerald-400" />
                            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">Agent</span>
                          </div>
                        )}
                        <div className="prose prose-invert prose-sm max-w-none font-sans text-white/90 whitespace-pre-wrap">
                          {msg.text}
                        </div>
                        
                        {msg.links && msg.links.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                            <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Sources</h4>
                            <div className="flex flex-wrap gap-2">
                              {msg.links.map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group text-xs font-sans text-white/70"
                                >
                                  <span className="truncate max-w-[150px]">{link.title}</span>
                                  <ExternalLink size={12} className="text-white/40 group-hover:text-emerald-400 flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                        <Loader2 size={16} className="animate-spin text-emerald-400" />
                        <span className="font-mono text-xs text-white/50">Searching the web...</span>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Ask anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm font-sans focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button
                  onClick={handleSearch}
                  disabled={isAnalyzing || !prompt.trim()}
                  className="absolute right-2 w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
