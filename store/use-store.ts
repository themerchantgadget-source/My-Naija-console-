import { create } from 'zustand';

export type Tab = 'Home' | 'Hub' | 'Marketplace' | 'Social Live' | 'Profile';

export interface ProductVariant {
  id: string;
  storage: string;
  price: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  variants: ProductVariant[];
  condition?: 'Brand New' | 'UK Used' | 'BOXED';
  seller?: string;
  isVerified?: boolean;
}

export interface EnquiryItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
}

interface AppState {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  
  enquiry: EnquiryItem[];
  addToEnquiry: (product: Product, variant: ProductVariant) => void;
  removeFromEnquiry: (variantId: string) => void;
  updateEnquiryQuantity: (variantId: string, quantity: number) => void;
  clearEnquiry: () => void;
  
  activeProduct: Product | null;
  setActiveProduct: (product: Product | null) => void;
  
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  isOrderTrackerOpen: boolean;
  setOrderTrackerOpen: (isOpen: boolean) => void;
  
  isEnquiryDrawerOpen: boolean;
  setEnquiryDrawerOpen: (isOpen: boolean) => void;

  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;

  reviews: Record<string, Review[]>;
  addReview: (productId: string, review: Review) => void;

  isAiModalOpen: boolean;
  setAiModalOpen: (isOpen: boolean) => void;

  isMapsModalOpen: boolean;
  setMapsModalOpen: (isOpen: boolean) => void;

  isSearchModalOpen: boolean;
  setSearchModalOpen: (isOpen: boolean) => void;

  hasPaid: boolean;
  setHasPaid: (hasPaid: boolean) => void;

  viewedProducts: Product[];
  addViewedProduct: (product: Product) => void;

  userPreferences: string[];
  setUserPreferences: (prefs: string[]) => void;
  userProfile: { name: string; email: string; phone: string; avatar?: string };
  updateUserProfile: (profile: Partial<{ name: string; email: string; phone: string; avatar?: string }>) => void;

  isSettingsModalOpen: boolean;
  setSettingsModalOpen: (isOpen: boolean) => void;

  clearViewedProducts: () => void;
  clearWishlist: () => void;
}

export const useStore = create<AppState>((set) => ({
  activeTab: 'Home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  enquiry: [],
  addToEnquiry: (product, variant) => set((state) => {
    const existing = state.enquiry.find((item) => item.variant.id === variant.id);
    if (existing) {
      return {
        enquiry: state.enquiry.map((item) =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    return { enquiry: [...state.enquiry, { product, variant, quantity: 1 }] };
  }),
  removeFromEnquiry: (variantId) => set((state) => ({
    enquiry: state.enquiry.filter((item) => item.variant.id !== variantId),
  })),
  updateEnquiryQuantity: (variantId, quantity) => set((state) => ({
    enquiry: state.enquiry.map((item) =>
      item.variant.id === variantId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    ),
  })),
  clearEnquiry: () => set({ enquiry: [] }),
  
  activeProduct: null,
  setActiveProduct: (product) => set({ activeProduct: product }),
  
  quickViewProduct: null,
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),
  
  isOrderTrackerOpen: false,
  setOrderTrackerOpen: (isOpen) => set({ isOrderTrackerOpen: isOpen }),
  
  isEnquiryDrawerOpen: false,
  setEnquiryDrawerOpen: (isOpen) => set({ isEnquiryDrawerOpen: isOpen }),

  wishlist: [],
  addToWishlist: (product) => set((state) => {
    if (state.wishlist.some(p => p.id === product.id)) return state;
    return { wishlist: [...state.wishlist, product] };
  }),
  removeFromWishlist: (productId) => set((state) => ({
    wishlist: state.wishlist.filter(p => p.id !== productId)
  })),

  reviews: {
    'p1': [
      { id: 'r1', userName: 'David O.', rating: 5, text: 'Absolutely incredible device. The titanium finish is stunning.', date: '2026-03-10' },
      { id: 'r2', userName: 'Sarah K.', rating: 4, text: 'Great phone, but the battery life could be slightly better.', date: '2026-03-12' }
    ]
  },
  addReview: (productId, review) => set((state) => ({
    reviews: {
      ...state.reviews,
      [productId]: [...(state.reviews[productId] || []), review]
    }
  })),

  isAiModalOpen: false,
  setAiModalOpen: (isOpen) => set({ isAiModalOpen: isOpen }),

  isMapsModalOpen: false,
  setMapsModalOpen: (isOpen) => set({ isMapsModalOpen: isOpen }),

  isSearchModalOpen: false,
  setSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),

  hasPaid: false,
  setHasPaid: (hasPaid) => set({ hasPaid }),

  viewedProducts: [],
  addViewedProduct: (product) => set((state) => {
    // Keep only the last 10 viewed products, avoid duplicates
    const filtered = state.viewedProducts.filter(p => p.id !== product.id);
    return { viewedProducts: [product, ...filtered].slice(0, 10) };
  }),

  userPreferences: ['Gaming', 'Tech Gadgets', 'Streetwear'],
  setUserPreferences: (prefs) => set({ userPreferences: prefs }),

  userProfile: { name: 'Maro E.', email: 'maro@example.com', phone: '+234 800 000 0000' },
  updateUserProfile: (profile) => set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),

  isSettingsModalOpen: false,
  setSettingsModalOpen: (isOpen) => set({ isSettingsModalOpen: isOpen }),

  clearViewedProducts: () => set({ viewedProducts: [] }),
  clearWishlist: () => set({ wishlist: [] }),
}));
