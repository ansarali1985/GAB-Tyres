import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { THEMES } from '../constants';
import { ArrowLeft, MessageCircle, Info, ChevronDown, PhoneCall } from 'lucide-react';

const BrandDetail: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const { brands, settings } = useApp();
  const themeStyles = THEMES[settings.theme];
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');

  const brand = brands.find(b => b.id === brandId);

  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Brand not found</h2>
        <button 
          onClick={() => navigate('/brands')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Brands
        </button>
      </div>
    );
  }

  // Defensive accessors: ensure arrays/objects exist to avoid runtime errors
  const availableSizes: string[] = Array.isArray(brand.availableSizes) ? brand.availableSizes : [];
  const sizeData: Record<string, any> = brand.sizeData && typeof brand.sizeData === 'object' ? brand.sizeData : {};
  const selectedSizeFinance = selectedSize ? sizeData[selectedSize] : null;

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      alert("Please select a tyre size first.");
      return;
    }

    const priceText = selectedSizeFinance && selectedSizeFinance.salePrice !== undefined
      ? `\nPrice: Rs. ${selectedSizeFinance.salePrice}`
      : '';
    const message = encodeURIComponent(
      `Hello ${settings.businessName}, I am interested in purchasing ${brand.name} tyres. \nSize: ${selectedSize}${priceText} \nPlease let me know the current availability.`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  const handleCallOrder = () => {
    window.open(`tel:${settings.phoneNumber}`, '_self');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/brands')}
        className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to Brands</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Brand Image & Description */}
        <div>
          <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white mb-10">
            <img 
              src={brand.image} 
              alt={brand.name} 
              className="w-full aspect-video object-cover" 
            />
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6">{brand.name}</h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {brand.description}
          </p>
          <div className="bg-blue-50 p-6 rounded-3xl flex items-start space-x-4 border border-blue-100">
            <Info className="text-blue-500 flex-shrink-0 mt-1" size={24} />
            <p className="text-blue-800 text-sm leading-relaxed">
              <strong>Why choose {brand.name}?</strong> This brand is known for its exceptional durability and reliability across varied road conditions. Perfect for both city drives and long highway commutes.
            </p>
          </div>
        </div>

        {/* Configuration Area */}
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 sticky top-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Configure Your Purchase</h2>
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Available Tyre Sizes</label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold text-gray-900 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Choose a size...</option>
                {availableSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={24} />
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex justify-between items-center py-4 border-b border-gray-50">
              <span className="text-gray-500">Selected Brand</span>
              <span className="font-bold text-gray-900">{brand.name}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-gray-50">
              <span className="text-gray-500">Selected Size</span>
              <span className={`font-bold ${selectedSize ? 'text-blue-600' : 'text-gray-300 italic'}`}>
                {selectedSize || 'Not selected'}
              </span>
            </div>
            {selectedSizeFinance && (
              <div className="flex justify-between items-center py-4 border-b border-gray-100 bg-blue-50/50 px-4 rounded-xl">
                <span className="text-gray-500">Retail Price</span>
                <span className="text-2xl font-black text-blue-700">Rs. {selectedSizeFinance.salePrice}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleWhatsAppOrder}
              className={`w-full ${themeStyles.primary} text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3`}
            >
              <MessageCircle size={20} fill="currentColor" />
              <span>Order WhatsApp</span>
            </button>
            <button
              onClick={handleCallOrder}
              className={`w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3`}
            >
              <PhoneCall size={20} />
              <span>Call Now</span>
            </button>
          </div>
          
          <p className="text-center text-gray-400 text-xs">
            Connect directly with our sales team for final pricing and appointment scheduling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
