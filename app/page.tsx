'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/use-store';
import NavigationPill from '@/components/NavigationPill';
import EnquiryPill from '@/components/EnquiryPill';

// Lazy load tabs for better initial load performance
const HomeTab = dynamic(() => import('@/components/tabs/HomeTab'), { ssr: false });
const HubTab = dynamic(() => import('@/components/tabs/HubTab'), { ssr: false });
const MarketplaceTab = dynamic(() => import('@/components/tabs/MarketplaceTab'), { ssr: false });
const SocialLiveTab = dynamic(() => import('@/components/tabs/SocialLiveTab'), { ssr: false });
const ProfileTab = dynamic(() => import('@/components/tabs/ProfileTab'), { ssr: false });

// Lazy load heavy modals and drawers
const ProductSheet = dynamic(() => import('@/components/ProductSheet'), { ssr: false });
const QuickViewModal = dynamic(() => import('@/components/QuickViewModal'), { ssr: false });
const OrderTracker = dynamic(() => import('@/components/OrderTracker'), { ssr: false });
const EnquiryDrawer = dynamic(() => import('@/components/EnquiryDrawer'), { ssr: false });
const AiAnalysisModal = dynamic(() => import('@/components/AiAnalysisModal'), { ssr: false });
const MapsAssistantModal = dynamic(() => import('@/components/MapsAssistantModal'), { ssr: false });
const FastSearchModal = dynamic(() => import('@/components/FastSearchModal'), { ssr: false });
const SettingsModal = dynamic(() => import('@/components/SettingsModal'), { ssr: false });

export default function Page() {
  const { activeTab, setActiveProduct, setQuickViewProduct, setAiModalOpen, setMapsModalOpen, setSearchModalOpen, setSettingsModalOpen } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProduct(null);
        setQuickViewProduct(null);
        setAiModalOpen(false);
        setMapsModalOpen(false);
        setSearchModalOpen(false);
        setSettingsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveProduct, setQuickViewProduct, setAiModalOpen, setMapsModalOpen, setSearchModalOpen, setSettingsModalOpen]);

  return (
    <main className="min-h-screen w-full relative overflow-hidden pb-32">
      {/* Active Tab Content */}
      <div className="w-full h-full">
        {activeTab === 'Home' && <HomeTab />}
        {activeTab === 'Hub' && <HubTab />}
        {activeTab === 'Marketplace' && <MarketplaceTab />}
        {activeTab === 'Social Live' && <SocialLiveTab />}
        {activeTab === 'Profile' && <ProfileTab />}
      </div>

      {/* Global Overlays */}
      <NavigationPill />
      <EnquiryPill />
      <EnquiryDrawer />
      <ProductSheet />
      <QuickViewModal />
      <OrderTracker />
      <AiAnalysisModal />
      <MapsAssistantModal />
      <FastSearchModal />
      <SettingsModal />
    </main>
  );
}
