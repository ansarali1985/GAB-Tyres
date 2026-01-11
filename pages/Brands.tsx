
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { THEMES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';

const Brands: React.FC = () => {
  const { brands, settings } = useApp();
  const themeStyles = THEMES[settings.theme];
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Tyre Brands</h1>
        <p className="text-gray-500 text-lg">Browse our extensive collection of high-quality tyre brands from around the world.</p>
      </div>

      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for a brand (e.g., Micheline, Yokohama...)"
          className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all text-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
            <div 
              key={brand.id}
              onClick={() => navigate(`/brands/${brand.id}`)}
              className="group cursor-pointer bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={brand.image} 
                  alt={brand.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{brand.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{brand.description}</p>
                <div className="flex justify-between items-center">
                  {/* Calculate total sizes from all patterns of the brand as TyreBrand does not have availableSizes directly */}
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{brand.patterns.reduce((sum, p) => sum + (p.availableSizes?.length || 0), 0)} Sizes Available</span>
                  <div className={`p-2 rounded-xl ${themeStyles.secondary} ${themeStyles.text} group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-2xl font-bold text-gray-400">No brands found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brands;
