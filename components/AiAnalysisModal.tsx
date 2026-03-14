'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/use-store';
import { X, Upload, Sparkles, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

export default function AiAnalysisModal() {
  const { isAiModalOpen, setAiModalOpen } = useStore();
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setAiModalOpen(false);
    setTimeout(() => {
      setFile(null);
      setPreviewUrl(null);
      setPrompt('');
      setResult(null);
      setIsAnalyzing(false);
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
        
        const defaultPrompt = activeTab === 'image' 
          ? "Analyze this image. If it's a receipt, extract the items and total. If it's a device, identify the model and condition. Otherwise, provide a detailed summary."
          : "Analyze this video content. Generate a summary of the key moments and highlights.";

        const finalPrompt = prompt.trim() || defaultPrompt;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { inlineData: { mimeType: file.type, data: base64Data } },
              { text: finalPrompt }
            ]
          }
        });

        setResult(response.text || 'No analysis generated.');
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error('Analysis error:', error);
      setResult('An error occurred during analysis. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <AnimatePresence>
      {isAiModalOpen && (
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
            className="relative w-full max-w-2xl bg-[#101012] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c8692c]/20 flex items-center justify-center text-[#c8692c]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl">AI Analysis Studio</h2>
                  <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
                <button
                  onClick={() => { setActiveTab('image'); setFile(null); setPreviewUrl(null); setResult(null); }}
                  className={`flex-1 py-2 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'image' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <ImageIcon size={14} /> Image Analysis
                </button>
                <button
                  onClick={() => { setActiveTab('video'); setFile(null); setPreviewUrl(null); setResult(null); }}
                  className={`flex-1 py-2 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'video' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <Video size={14} /> Video Understanding
                </button>
              </div>

              {/* Upload Area */}
              {!file ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 hover:border-[#c8692c]/50 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[#c8692c] transition-colors">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-sans text-sm font-medium mb-1">
                      Upload {activeTab === 'image' ? 'an image' : 'a video'} to analyze
                    </p>
                    <p className="font-mono text-xs text-white/40">
                      {activeTab === 'image' ? 'Receipts, menus, charts, or devices' : 'MP4, WebM (Max 50MB for browser processing)'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative w-full aspect-video rounded-2xl bg-black/50 overflow-hidden border border-white/10">
                    {activeTab === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewUrl!} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <video src={previewUrl!} controls className="w-full h-full object-contain" />
                    )}
                    <button
                      onClick={() => { setFile(null); setPreviewUrl(null); setResult(null); }}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-xs text-white/40 uppercase tracking-widest pl-1">Custom Prompt (Optional)</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={activeTab === 'image' ? "E.g., Extract all items and prices from this receipt..." : "E.g., Give me a 3-bullet summary of this video..."}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-sans focus:outline-none focus:border-[#c8692c]/50 min-h-[100px] resize-none"
                    />
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-[#c8692c] text-white font-mono text-xs uppercase tracking-wider rounded-xl hover:bg-[#e07a36] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Generate Analysis
                      </>
                    )}
                  </button>

                  {/* Results */}
                  <AnimatePresence>
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white/5 border border-[#c8692c]/30 rounded-2xl"
                      >
                        <h3 className="font-mono text-xs text-[#c8692c] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Sparkles size={14} /> Analysis Result
                        </h3>
                        <div className="prose prose-invert prose-sm max-w-none font-sans text-white/80">
                          <Markdown>{result}</Markdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept={activeTab === 'image' ? "image/*" : "video/*"}
                className="hidden"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
