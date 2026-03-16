'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Home, Grid, Store, Radio, User } from 'lucide-react';
import { useStore, Tab } from '@/store/use-store';

const TABS: { id: Tab; icon: React.ElementType; label: string }[] = [
  { id: 'Home', icon: Home, label: 'Home' },
  { id: 'Hub', icon: Grid, label: 'Hub' },
  { id: 'Marketplace', icon: Store, label: 'Market' },
  { id: 'Social Live', icon: Radio, label: 'Live' },
  { id: 'Profile', icon: User, label: 'Profile' },
];

export default function NavigationPill() {
  const { activeTab, setActiveTab } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-[env(safe-area-inset-bottom,16px)] mb-4 pointer-events-none">
      <motion.nav
        className="glass-panel rounded-full flex items-center px-2 pointer-events-auto border border-white/10 shadow-2xl"
        initial={false}
        animate={{
          height: isExpanded ? 80 : 56,
          gap: isExpanded ? 16 : 8,
        }}
        transition={{ ease: [0.34, 1.15, 0.64, 1], duration: 0.5 }}
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center rounded-full transition-colors ${
                isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
              style={{
                height: isExpanded ? 64 : 40,
                padding: isExpanded ? '0 20px' : '0 12px',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ ease: [0.34, 1.15, 0.64, 1], duration: 0.5 }}
                />
              )}
              <div className="relative flex items-center gap-2">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-sans text-sm font-medium whitespace-nowrap"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </div>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
