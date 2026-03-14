'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/use-store';
import NavigationPill from '@/components/NavigationPill';
import EnquiryPill from '@/components/EnquiryPill';
import ProductSheet from '@/components/ProductSheet';
import QuickViewModal from '@/components/QuickViewModal';
import OrderTracker from '@/components/OrderTracker';
import HomeTab from '@/components/tabs/HomeTab';
import HubTab from '@/components/tabs/HubTab';
import MarketplaceTab from '@/components/tabs/MarketplaceTab';
import SocialLiveTab from '@/components/tabs/SocialLiveTab';
import ProfileTab from '@/components/tabs/ProfileTab';

import EnquiryDrawer from '@/components/EnquiryDrawer';
import AiAnalysisModal from '@/components/AiAnalysisModal';
import MapsAssistantModal from '@/components/MapsAssistantModal';
import FastSearchModal from '@/components/FastSearchModal';

export default function Page() {
  const { activeTab, setActiveProduct, setQuickViewProduct, setAiModalOpen, setMapsModalOpen, setSearchModalOpen } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProduct(null);
        setQuickViewProduct(null);
        setAiModalOpen(false);
        setMapsModalOpen(false);
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveProduct, setQuickViewProduct, setAiModalOpen, setMapsModalOpen, setSearchModalOpen]);

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
    </main>
  );
}
