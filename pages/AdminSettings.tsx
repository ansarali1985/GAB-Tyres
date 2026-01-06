import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ThemeType, FooterLink, BusinessHour, SocialLink } from '../types';
import { Save, User, Shield, Phone, MapPin, Palette, CheckCircle, Globe, Clock, Share2, Plus, Trash2, PhoneCall, Mail } from 'lucide-react';
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
    if (key === 'footerQuickLinks') {
      const newItem: FooterLink = { id: Date.now().toString(), label: 'New Link', url: '#' };
      setFormData({ ...formData, footerQuickLinks: [...formData.footerQuickLinks, newItem] });
    } else if (key === 'footerBusinessHours') {
      const newItem: BusinessHour = { id: Date.now().toString(), day: 'New Day', hours: '00:00 - 00:00' };
      setFormData({ ...formData, footerBusinessHours: [...formData.footerBusinessHours, newItem] });
    } else if (key === 'footerSocials') {
      const newItem: SocialLink = { id: Date.now().toString(), platform: 'NEW', url: '#' };
      setFormData({ ...formData, footerSocials: [...formData.footerSocials, newItem] });
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

  const themes = [
    { type: ThemeType.DEFAULT, name: 'Professional Blue', color: 'bg-blue-600' },
    { type: ThemeType.DARK, name: 'Midnight Dark', color: 'bg-zinc-900' },
    { type: ThemeType.LUXURY, name: 'Royal Stone', color: 'bg-amber-900' },
    { type: ThemeType.VIBRANT, name: 'Energetic Red', color: 'bg-red-600' },
    { type: ThemeType.NATURE, name: 'Forest Green', color: 'bg-emerald-700' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900">System Settings</h1>
        <p className="text-gray-500 font-medium">Configure global application behavior, footer content, and security</p>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        {/* Theme Selector */}
        <section className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
          <div className="flex items-center space-x-3 mb-8">
            <Palette className="text-purple-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Application Theme</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => setFormData({...formData, theme: t.type})}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center space-y-3 ${
                  formData.theme === t.type 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl ${t.color} shadow-lg`}></div>
                <span className={`font-bold ${formData.theme === t.type ? 'text-purple-700' : 'text-gray-500'}`}>{t.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Business Info */}
        <section className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
          <div className="flex items-center space-x-3 mb-8">
            <Phone className="text-emerald-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Business Name</label>
                <input 
                  type="text"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Business Email</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData({...formData, businessEmail: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">WhatsApp</label>
                  <input 
                    type="text"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Call</label>
                  <input 
                    type="text"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Address</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-6 text-gray-400" size={20} />
                <textarea 
                  rows={3}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-900"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Management Section */}
        <section className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-12">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="text-blue-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Footer Content Management</h2>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Footer Description</label>
            <textarea 
              rows={3}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-slate-900"
              value={formData.footerDescription}
              onChange={(e) => setFormData({...formData, footerDescription: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Quick Links */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <Globe size={18} className="text-blue-500" />
                  <span>Quick Links</span>
                </h3>
                <button type="button" onClick={() => addItem('footerQuickLinks')} className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm font-bold">
                  <Plus size={16} />
                  <span>Add Link</span>
                </button>
              </div>
              <div className="space-y-4">
                {formData.footerQuickLinks.map(link => (
                  <div key={link.id} className="flex space-x-2 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <input 
                      className="w-1/3 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900" 
                      placeholder="Label" 
                      value={link.label}
                      onChange={(e) => updateItem('footerQuickLinks', link.id, 'label', e.target.value)}
                    />
                    <input 
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-900" 
                      placeholder="URL (#)" 
                      value={link.url}
                      onChange={(e) => updateItem('footerQuickLinks', link.id, 'url', e.target.value)}
                    />
                    <button type="button" onClick={() => removeItem('footerQuickLinks', link.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <Clock size={18} className="text-emerald-500" />
                  <span>Business Hours</span>
                </h3>
                <button type="button" onClick={() => addItem('footerBusinessHours')} className="text-emerald-600 hover:text-emerald-800 flex items-center space-x-1 text-sm font-bold">
                  <Plus size={16} />
                  <span>Add Row</span>
                </button>
              </div>
              <div className="space-y-4">
                {formData.footerBusinessHours.map(hour => (
                  <div key={hour.id} className="flex space-x-2 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <input 
                      className="w-1/3 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900" 
                      placeholder="Day Range" 
                      value={hour.day}
                      onChange={(e) => updateItem('footerBusinessHours', hour.id, 'day', e.target.value)}
                    />
                    <input 
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-900" 
                      placeholder="Hours (e.g. 9:00 - 18:00)" 
                      value={hour.hours}
                      onChange={(e) => updateItem('footerBusinessHours', hour.id, 'hours', e.target.value)}
                    />
                    <button type="button" onClick={() => removeItem('footerBusinessHours', hour.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Share2 size={18} className="text-purple-500" />
                <span>Social Media Redirects</span>
              </h3>
              <button type="button" onClick={() => addItem('footerSocials')} className="text-purple-600 hover:text-purple-800 flex items-center space-x-1 text-sm font-bold">
                <Plus size={16} />
                <span>Add Social</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.footerSocials.map(social => (
                <div key={social.id} className="flex space-x-2 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <input 
                    className="w-20 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-black text-center text-slate-900" 
                    placeholder="TAG (FB)" 
                    value={social.platform}
                    maxLength={4}
                    onChange={(e) => updateItem('footerSocials', social.id, 'platform', e.target.value)}
                  />
                  <input 
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-900" 
                    placeholder="Profile URL" 
                    value={social.url}
                    onChange={(e) => updateItem('footerSocials', social.id, 'url', e.target.value)}
                  />
                  <button type="button" onClick={() => removeItem('footerSocials', social.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security / Admin Credentials */}
        <section className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="text-red-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Admin Security</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Login Username</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-red-500 transition-all font-bold text-slate-900"
                  value={formData.adminUsername}
                  onChange={(e) => setFormData({...formData, adminUsername: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Login Password</label>
              <div className="relative">
                <Shield className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-red-500 transition-all font-bold text-slate-900"
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                />
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-400 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
            Note: Changing these will immediately update the credentials required for the hidden login double-click.
          </p>
        </section>

        {/* Floating Action Bar */}
        <div className="sticky bottom-8 z-20 flex justify-center">
          <button 
            type="submit"
            className="bg-black text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
          >
            {saveSuccess ? (
              <>
                <CheckCircle size={24} className="text-green-400" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;