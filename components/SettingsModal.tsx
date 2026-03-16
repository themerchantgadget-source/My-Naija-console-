'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Sliders, Shield, Trash2, Plus } from 'lucide-react';
import { useStore } from '@/store/use-store';

type SettingsTab = 'account' | 'preferences' | 'privacy';

export default function SettingsModal() {
  const { 
    isSettingsModalOpen, 
    setSettingsModalOpen, 
    userProfile, 
    updateUserProfile,
    userPreferences,
    setUserPreferences,
    clearViewedProducts,
    clearWishlist,
    clearEnquiry
  } = useStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [editProfile, setEditProfile] = useState(userProfile);
  const [newPref, setNewPref] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const validateProfile = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', phone: '' };

    if (!editProfile.name.trim()) {
      newErrors.name = 'Display name is required.';
      isValid = false;
    } else if (editProfile.name.trim().length < 2) {
      newErrors.name = 'Display name must be at least 2 characters.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editProfile.email.trim()) {
      newErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!emailRegex.test(editProfile.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (!editProfile.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
      isValid = false;
    } else if (!phoneRegex.test(editProfile.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProfile = () => {
    if (validateProfile()) {
      updateUserProfile(editProfile);
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleAddPref = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPref.trim() && !userPreferences.includes(newPref.trim())) {
      setUserPreferences([...userPreferences, newPref.trim()]);
      setNewPref('');
    }
  };

  const handleRemovePref = (pref: string) => {
    setUserPreferences(userPreferences.filter(p => p !== pref));
  };

  return (
    <AnimatePresence>
      {isSettingsModalOpen && (
        <div key="settings-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
            onClick={() => setSettingsModalOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl h-[80vh] max-h-[800px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row pointer-events-auto relative z-10"
          >
            {/* Sidebar */}
            <div className="w-full sm:w-64 bg-white/5 border-r border-white/10 flex flex-col shrink-0">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="font-serif text-xl">Settings</h2>
                <button 
                  onClick={() => setSettingsModalOpen(false)}
                  className="sm:hidden p-2 bg-white/5 rounded-full hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 space-y-2 overflow-y-auto">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'account' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
                >
                  <User size={18} /> Account
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'preferences' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
                >
                  <Sliders size={18} /> Preferences
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'privacy' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
                >
                  <Shield size={18} /> Data & Privacy
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <div className="absolute top-4 right-4 hidden sm:block">
                <button 
                  onClick={() => setSettingsModalOpen(false)}
                  className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-10">
                {activeTab === 'account' && (
                  <div className="max-w-md space-y-6">
                    <div>
                      <h3 className="text-2xl font-serif mb-1">Account Details</h3>
                      <p className="text-sm text-white/50">Manage your personal information.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Display Name</label>
                        <input 
                          type="text" 
                          value={editProfile.name}
                          onChange={(e) => {
                            setEditProfile({...editProfile, name: e.target.value});
                            if (errors.name) setErrors({...errors, name: ''});
                          }}
                          className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c8692c]/50 transition-colors`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Email Address</label>
                        <input 
                          type="email" 
                          value={editProfile.email}
                          onChange={(e) => {
                            setEditProfile({...editProfile, email: e.target.value});
                            if (errors.email) setErrors({...errors, email: ''});
                          }}
                          className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c8692c]/50 transition-colors`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          value={editProfile.phone}
                          onChange={(e) => {
                            setEditProfile({...editProfile, phone: e.target.value});
                            if (errors.phone) setErrors({...errors, phone: ''});
                          }}
                          className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c8692c]/50 transition-colors`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                      <button 
                        onClick={handleSaveProfile}
                        className="mt-4 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors"
                      >
                        Save Changes
                      </button>
                      {successMessage && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-green-500 text-sm mt-2"
                        >
                          {successMessage}
                        </motion.p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="max-w-md space-y-6">
                    <div>
                      <h3 className="text-2xl font-serif mb-1">AI Preferences</h3>
                      <p className="text-sm text-white/50">Tune the AI recommendation engine by adding your interests.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Your Interests</label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {userPreferences.map(pref => (
                          <div key={pref} className="flex items-center gap-2 bg-[#c8692c]/10 border border-[#c8692c]/30 text-[#c8692c] px-3 py-1.5 rounded-lg text-sm">
                            {pref}
                            <button onClick={() => handleRemovePref(pref)} className="hover:text-white transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {userPreferences.length === 0 && (
                          <span className="text-sm text-white/30 italic">No preferences set.</span>
                        )}
                      </div>

                      <form onSubmit={handleAddPref} className="flex gap-2">
                        <input 
                          type="text" 
                          value={newPref}
                          onChange={(e) => setNewPref(e.target.value)}
                          placeholder="e.g. Mechanical Keyboards"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c8692c]/50 transition-colors"
                        />
                        <button 
                          type="submit"
                          disabled={!newPref.trim()}
                          className="px-4 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                        >
                          <Plus size={20} />
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="max-w-md space-y-6">
                    <div>
                      <h3 className="text-2xl font-serif mb-1">Data & Privacy</h3>
                      <p className="text-sm text-white/50">Manage your local data and browsing history.</p>
                    </div>

                    <div className="space-y-4">
                      {successMessage && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-green-500/10 border border-green-500/30 text-green-500 rounded-xl text-sm mb-4"
                        >
                          {successMessage}
                        </motion.div>
                      )}
                      <div className="p-4 border border-white/10 rounded-xl bg-white/5 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Browsing History</h4>
                          <p className="text-xs text-white/50 mt-1">Clear your recently viewed items.</p>
                        </div>
                        <button 
                          onClick={() => { clearViewedProducts(); setSuccessMessage('History cleared'); setTimeout(() => setSuccessMessage(''), 3000); }}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="p-4 border border-white/10 rounded-xl bg-white/5 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Wishlist</h4>
                          <p className="text-xs text-white/50 mt-1">Remove all items from your wishlist.</p>
                        </div>
                        <button 
                          onClick={() => { clearWishlist(); setSuccessMessage('Wishlist cleared'); setTimeout(() => setSuccessMessage(''), 3000); }}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="p-4 border border-white/10 rounded-xl bg-white/5 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Active Enquiry</h4>
                          <p className="text-xs text-white/50 mt-1">Clear your current shopping cart/enquiry.</p>
                        </div>
                        <button 
                          onClick={() => { clearEnquiry(); setSuccessMessage('Enquiry cleared'); setTimeout(() => setSuccessMessage(''), 3000); }}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
