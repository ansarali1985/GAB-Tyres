
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ThemeType, FooterLink, BusinessHour, SocialLink } from '../types';
import { Save, User, Shield, Phone, MapPin, Palette, CheckCircle, Globe, Clock, Share2, Plus, Trash2, Layout, Eye, EyeOff, Image as ImageIcon, Type } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminSettings: React.FC = () => {
  const { isAdmin, settings, setSettings } = useApp();
  const [formData, setFormData] = useState({...settings});
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addItem = (key: 'footerQuickLinks' | 'footerBusinessHours' | 'footerSocials') => {
    const id = Date.now().toString();
    if (key === 'footerQuickLinks') {
      setFormData({ ...formData, footerQuickLinks: [...formData.footerQuickLinks, { id, label: 'New Link', url: '#' }] });
    } else if (key === 'footerBusinessHours') {
      setFormData({ ...formData, footerBusinessHours: [...formData.footerBusinessHours, { id, day: 'New Day', hours: '0:00 - 0:00' }] });
    } else if (key === 'footerSocials') {
      setFormData({ ...formData, footerSocials: [...formData.footerSocials, { id, platform: 'TAG', url: '#' }] });
    }
  };

  const removeItem = (key: 'footerQuickLinks' | 'footerBusinessHours' | 'footerSocials', id: string) => {
    setFormData({ ...formData, [key]: (formData[key] as any[]).filter(item => item.id !== id) });
  };

  const updateItem = (key: 'footerQuickLinks' | 'footerBusinessHours' | 'footerSocials', id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      [key]: (formData[key] as any[]).map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900">System Settings</h1>
        <p className="text-gray-500 font-medium">Configure visuals, dashboard content, and security</p>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        
        {/* Dashboard Content Management */}
        <section className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Layout className="text-orange-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Content & Layout</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Visibility Toggles */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Section Visibility</h3>
              <div className="space-y-3">
                {[
                  { key: 'showHero', label: 'Hero / Car Banner' },
                  { key: 'showBrands', label: 'Featured Brands' },
                  { key: 'showServices', label: 'Services Center' },
                  { key: 'showTrust', label: 'Trust Badges' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFormData({...formData, [item.key]: !formData[item.key as keyof typeof formData]})}
                    className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${formData[item.key as keyof typeof formData] ? 'bg-white border-orange-500 text-orange-600 shadow-sm' : 'bg-transparent border-gray-200 text-gray-400'}`}
                  >
                    <span className="font-bold">{item.label}</span>
                    {formData[item.key as keyof typeof formData] ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Main Dashboard Car/Hero Image</label>
              <div className="space-y-3">
                <div className="relative">
                  <ImageIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-orange-500 transition-all text-sm text-slate-900"
                    placeholder="Hero Image URL..."
                    value={formData.homeHeroImage}
                    onChange={(e) => setFormData({...formData, homeHeroImage: e.target.value})}
                  />
                </div>
                <div className="h-40 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={formData.homeHeroImage} className="w-full h-full object-cover" alt="Hero Preview" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Text Content & Placement</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Hero Title</label>
                <input 
                  type="text"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 text-slate-900 font-bold"
                  value={formData.homeHeroTitle}
                  onChange={(e) => setFormData({...formData, homeHeroTitle: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Hero Subtitle</label>
                <input 
                  type="text"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 text-slate-900"
                  value={formData.homeHeroSubtitle}
                  onChange={(e) => setFormData({...formData, homeHeroSubtitle: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Brands Section Title</label>
                <input 
                  type="text"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 text-slate-900 font-bold"
                  value={formData.homeBrandsTitle}
                  onChange={(e) => setFormData({...formData, homeBrandsTitle: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Services Section Title</label>
                <input 
                  type="text"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 text-slate-900 font-bold"
                  value={formData.homeServicesTitle}
                  onChange={(e) => setFormData({...formData, homeServicesTitle: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Services Subtitle</label>
                <textarea 
                  rows={2}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-500 text-slate-900"
                  value={formData.homeServicesSubtitle}
                  onChange={(e) => setFormData({...formData, homeServicesSubtitle: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>
        </section>

        {/* Previous Sections Restored / Maintained */}
        <section className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
          <div className="flex items-center space-x-3 mb-8">
            <Palette className="text-purple-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Application Theme</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { type: ThemeType.DEFAULT, name: 'Professional Blue', color: 'bg-blue-600' },
              { type: ThemeType.DARK, name: 'Midnight Dark', color: 'bg-zinc-900' },
              { type: ThemeType.LUXURY, name: 'Royal Stone', color: 'bg-amber-900' },
              { type: ThemeType.VIBRANT, name: 'Energetic Red', color: 'bg-red-600' },
              { type: ThemeType.NATURE, name: 'Forest Green', color: 'bg-emerald-700' },
            ].map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => setFormData({...formData, theme: t.type})}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center space-y-3 ${
                  formData.theme === t.type ? 'border-purple-500 bg-purple-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl ${t.color} shadow-lg`}></div>
                <span className={`font-bold ${formData.theme === t.type ? 'text-purple-700' : 'text-gray-500'}`}>{t.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Business Profile */}
        <section className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
          <div className="flex items-center space-x-3 mb-8">
            <Phone className="text-emerald-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none text-slate-900 font-bold"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            />
            <input 
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none text-slate-900 font-bold"
              placeholder="Business Email"
              value={formData.businessEmail}
              onChange={(e) => setFormData({...formData, businessEmail: e.target.value})}
            />
            <input 
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none text-slate-900 font-bold"
              placeholder="WhatsApp"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
            />
            <input 
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none text-slate-900 font-bold"
              placeholder="Phone Call"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            />
            <textarea 
              className="md:col-span-2 w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none text-slate-900"
              placeholder="Address"
              rows={2}
              value={formData.businessAddress}
              onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
            />
          </div>
        </section>

        {/* Floating Save Button */}
        <div className="sticky bottom-8 z-20 flex justify-center">
          <button type="submit" className="bg-black text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-all flex items-center space-x-3">
            {saveSuccess ? (
              <>
                <CheckCircle size={24} className="text-green-400" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>Save All Updates</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
