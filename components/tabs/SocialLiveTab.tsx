'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Heart, MessageCircle, ExternalLink, Twitter, Facebook, Video } from 'lucide-react';

const MOCK_POSTS = [
  {
    id: 's1',
    platform: 'X',
    author: 'TheMerchant',
    handle: '@TheMerchantPH',
    content: 'Just landed: 50 units of the iPhone 17 Pro Max in Desert Titanium. The finish on these is absolutely unreal. Available now in the Hub. 🚀',
    time: '2h ago',
    likes: 124,
    comments: 18,
    image: 'https://picsum.photos/seed/iphone17desert/800/600',
  },
  {
    id: 's2',
    platform: 'TikTok',
    author: 'TheMerchant',
    handle: '@themerchant_hq',
    content: 'Watch us restore this water-damaged MacBook Pro M3 back to factory condition. The logic board repair was intense! 💻✨',
    time: '5h ago',
    likes: 892,
    comments: 145,
    image: 'https://picsum.photos/seed/macbookrepair/800/1200',
  },
  {
    id: 's3',
    platform: 'Facebook',
    author: 'TheMerchant',
    handle: 'TheMerchant PH',
    content: 'Our Eleme/Oyigbo delivery zone is now fully operational! Guaranteeing 4-hour delivery for all orders placed before 2 PM. Thank you for your patience as we expanded our network.',
    time: '1d ago',
    likes: 340,
    comments: 56,
  },
];

export default function SocialLiveTab() {
  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar pb-32 bg-[#f5f5f0] text-[#1a1a1a]">
      <header className="px-6 pt-16 pb-8 border-b border-[#1a1a1a]/10">
        <h1 className="font-serif text-5xl tracking-tight leading-none mb-4">
          Social<br />Live.
        </h1>
        <p className="font-sans text-sm text-[#1a1a1a]/60 uppercase tracking-widest">
          The Daily Dispatch
        </p>
      </header>

      <div className="divide-y divide-[#1a1a1a]/10">
        {MOCK_POSTS.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ delay: index * 0.1, ease: [0.34, 1.15, 0.64, 1] }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white shrink-0">
                  {post.platform === 'X' && <Twitter size={16} />}
                  {post.platform === 'Facebook' && <Facebook size={16} />}
                  {post.platform === 'TikTok' && <Video size={16} />}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm">{post.author}</h3>
                  <p className="font-mono text-xs text-[#1a1a1a]/50">{post.handle} • {post.time}</p>
                </div>
              </div>
              <a
                href="#"
                className="flex items-center gap-1 font-sans text-xs font-medium text-[#c8692c] hover:underline"
              >
                View Original <ExternalLink size={12} />
              </a>
            </div>

            <p className="font-serif text-xl leading-relaxed mb-6">
              {post.content}
            </p>

            {post.image && (
              <div className="w-full bg-[#1a1a1a]/5 rounded-xl overflow-hidden mb-6 border border-[#1a1a1a]/10 relative aspect-[4/3]">
                <Image
                  src={post.image}
                  alt="Post attachment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 42rem"
                />
              </div>
            )}

            <div className="flex items-center gap-6 border-t border-[#1a1a1a]/10 pt-4">
              <button className="flex items-center gap-2 font-sans text-sm font-medium text-[#1a1a1a]/60 hover:text-[#c8692c] transition-colors">
                <Heart size={18} /> {post.likes}
              </button>
              <button className="flex items-center gap-2 font-sans text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
                <MessageCircle size={18} /> {post.comments}
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
