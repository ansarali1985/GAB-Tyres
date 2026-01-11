import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { THEMES } from '../constants';
import { ArrowLeft, MessageCircle, Info, ChevronDown, ListFilter, LayoutGrid } from 'lucide-react';

const BrandDetail: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const { brands, settings } = useApp();
  const themeStyles = THEMES[settings.theme];
  const navigate = useNavigate();
  
  const [selectedPatternId, setSelectedPatternId] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  const brand = brands.find(b => b.id === brandId);

  // Find the selected pattern object
  const selectedPattern = useMemo(() => 
    brand?.patterns.find(p => p.id === selectedPatternId),
    [brand, selectedPatternId]
  );

  // Get finance data for the specific size within the pattern
  const selectedSizeFinance = useMemo(() => 
    (selectedPattern && selectedSize) ? selectedPattern.sizeData[selectedSize] : null,
    [selectedPattern, selectedSize]
  );

  if (!brand) return <div className="text-center py-20">Brand not found</div>;

  const handleWhatsAppOrder = () => {
    if (!selectedPatternId || !selectedSize) {
      alert("Please select both a pattern and a tyre size.");
      return;
    }
    
    const message = encodeURIComponent(
      `Hello ${settings.businessName},\n\n` +
      `I am interested in:\n` +
      `Brand: ${brand.name}\n` +
      `Pattern: ${selectedPattern?.name}\n` +
      `Size: ${selectedSize}\n` +
      `Price: Rs. ${selectedSizeFinance?.salePrice || 'Contact for price'}`
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
            {/* 1. Pattern Selection */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-3">1. Select Pattern / Model</label>
              <div className="relative">
                <select 
                  className="w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-lg font-bold appearance-none cursor-pointer" 
                  value={selectedPatternId} 
                  onChange={e => {
                    setSelectedPatternId(e.target.value);
                    setSelectedSize(''); // Reset size when pattern changes
                  }}
                >
                  <option value="">Choose a model...</option>
                  {brand.patterns.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ListFilter className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 2. Size Selection (Depends on Pattern) */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-3">2. Select Tyre Size</label>
              <div className="relative">
                <select 
                  className="w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-lg font-bold appearance-none cursor-pointer disabled:opacity-40" 
                  value={selectedSize} 
                  onChange={e => setSelectedSize(e.target.value)}
                  disabled={!selectedPatternId}
                >
                  <option value="">{selectedPatternId ? "Choose a size..." : "Select a pattern first"}</option>
                  {selectedPattern?.availableSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <LayoutGrid className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          {selectedSizeFinance && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center py-6 bg-blue-50 px-8 rounded-3xl border border-blue-100">
                <div>
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Standard Price</p>
                  <span className="text-3xl font-black text-blue-700">Rs. {selectedSizeFinance.salePrice.toLocaleString()}</span>
                </div>
                <Info size={24} className="text-blue-300" />
              </div>
            </div>
          )}

          <button 
            onClick={handleWhatsAppOrder} 
            disabled={!selectedSize}
            className={`w-full ${themeStyles.primary} text-white py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 transition-all active:scale-[0.98]`}
          >
            <MessageCircle size={20} fill="currentColor" />
            <span>Order via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
