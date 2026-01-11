import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { THEMES } from '../constants';
import { ArrowLeft, MessageCircle, Info, ChevronDown, PhoneCall, ListFilter } from 'lucide-react';

const BrandDetail: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const { brands, settings } = useApp();
  const themeStyles = THEMES[settings.theme];
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedPattern, setSelectedPattern] = useState<string>('');

  const brand = brands.find(b => b.id === brandId);

  if (!brand) return <div className="text-center py-20">Brand not found</div>;

  const selectedSizeFinance = selectedSize ? brand.sizeData[selectedSize] : null;

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      alert("Please select a tyre size first.");
      return;
    }
    const patternText = selectedPattern ? `\nPattern: ${selectedPattern}` : '';
    const priceText = selectedSizeFinance ? `\nPrice: Rs. ${selectedSizeFinance.salePrice}` : '';
    const message = encodeURIComponent(
      `Hello ${settings.businessName}, I am interested in ${brand.name} tyres. \nSize: ${selectedSize}${patternText}${priceText}`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate('/brands')} className="flex items-center space-x-2 text-gray-500 mb-8 font-medium">
        <ArrowLeft size={18} />
        <span>Back to Brands</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <img src={brand.image} className="w-full aspect-video object-cover rounded-[40px] shadow-2xl mb-10" />
          <h1 className="text-5xl font-black mb-6">{brand.name}</h1>
          <p className="text-xl text-gray-600 mb-8">{brand.description}</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-8">Configure Your Order</h2>
          
          <div className="space-y-6 mb-10">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-3">1. Select Tyre Size</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-lg font-bold appearance-none cursor-pointer" value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
                  <option value="">Choose a size...</option>
                  {brand.availableSizes.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-3">2. Select Pattern / Model</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-lg font-bold appearance-none cursor-pointer disabled:opacity-50" value={selectedPattern} onChange={e => setSelectedPattern(e.target.value)} disabled={!brand.patterns || brand.patterns.length === 0}>
                  <option value="">{brand.patterns?.length ? "Choose a pattern..." : "No patterns defined"}</option>
                  {brand.patterns?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ListFilter className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10">
             {selectedSizeFinance && (
              <div className="flex justify-between items-center py-4 bg-blue-50 px-6 rounded-2xl">
                <span className="text-gray-500 font-bold">Total Price</span>
                <span className="text-2xl font-black text-blue-700">Rs. {selectedSizeFinance.salePrice}</span>
              </div>
            )}
          </div>

          <button onClick={handleWhatsAppOrder} className={`w-full ${themeStyles.primary} text-white py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center space-x-3`}>
            <MessageCircle size={20} fill="currentColor" />
            <span>Order via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
