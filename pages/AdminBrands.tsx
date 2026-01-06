
import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { ALL_TYRE_SIZES } from '../constants';
import { TyreBrand, SizeFinance } from '../types';
import { Plus, Trash2, Edit2, X, Check, Save, Upload, Image as ImageIcon, DollarSign, Calculator } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminBrands: React.FC = () => {
  const { isAdmin, brands, setBrands } = useApp();
  const [editingBrand, setEditingBrand] = useState<TyreBrand | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newBrand, setNewBrand] = useState<Partial<TyreBrand>>({
    name: '',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400',
    description: '',
    availableSizes: [],
    sizeData: {}
  });

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isAdding) {
          setNewBrand(prev => ({ ...prev, image: base64String }));
        } else if (editingBrand) {
          setEditingBrand(prev => prev ? ({ ...prev, image: base64String }) : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleSize = (brand: Partial<TyreBrand>, size: string) => {
    const currentSizes = brand.availableSizes || [];
    const currentData = brand.sizeData || {};
    let updatedSizes: string[];
    let updatedData = { ...currentData };

    if (currentSizes.includes(size)) {
      updatedSizes = currentSizes.filter(s => s !== size);
      delete updatedData[size];
    } else {
      updatedSizes = [...currentSizes, size];
      updatedData[size] = { salePrice: 0, purchasePrice: 0, otherExpenses: 0 };
    }
    
    if (editingBrand) setEditingBrand({ ...editingBrand, availableSizes: updatedSizes, sizeData: updatedData });
    else setNewBrand({ ...newBrand, availableSizes: updatedSizes, sizeData: updatedData });
  };

  const handleUpdateFinance = (size: string, field: keyof SizeFinance, value: number) => {
    if (editingBrand) {
      const updatedData = { ...editingBrand.sizeData };
      updatedData[size] = { ...updatedData[size], [field]: value };
      setEditingBrand({ ...editingBrand, sizeData: updatedData });
    } else {
      const updatedData = { ...newBrand.sizeData };
      updatedData[size] = { ...updatedData[size], [field]: value };
      setNewBrand({ ...newBrand, sizeData: updatedData });
    }
  };

  const addCustomSize = () => {
    if (!customSize.trim()) return;
    const brand = isAdding ? newBrand : editingBrand;
    if (!brand) return;
    const currentSizes = brand.availableSizes || [];
    if (!currentSizes.includes(customSize.trim())) {
      const updatedSizes = [...currentSizes, customSize.trim()];
      const updatedData = { ...brand.sizeData, [customSize.trim()]: { salePrice: 0, purchasePrice: 0, otherExpenses: 0 } };
      if (isAdding) setNewBrand({ ...newBrand, availableSizes: updatedSizes, sizeData: updatedData });
      else setEditingBrand({ ...editingBrand!, availableSizes: updatedSizes, sizeData: updatedData });
    }
    setCustomSize('');
  };

  const handleSaveNew = () => {
    if (!newBrand.name) return alert("Name is required");
    const brand: TyreBrand = {
      id: Date.now().toString(),
      name: newBrand.name!,
      image: newBrand.image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400',
      description: newBrand.description || '',
      availableSizes: newBrand.availableSizes || [],
      sizeData: newBrand.sizeData || {}
    };
    setBrands([...brands, brand]);
    setIsAdding(false);
    setNewBrand({ name: '', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400', description: '', availableSizes: [], sizeData: {} });
  };

  const handleSaveEdit = () => {
    if (!editingBrand) return;
    setBrands(brands.map(b => b.id === editingBrand.id ? editingBrand : b));
    setEditingBrand(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      setBrands(brands.filter(b => b.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Brand Management</h1>
          <p className="text-gray-500 font-medium">Control your tyre inventory, pricing, and availability</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-blue-100 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Brand Form Modal (Add or Edit) */}
      {(isAdding || editingBrand) && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">
                {isAdding ? 'Create New Brand' : `Edit ${editingBrand?.name}`}
              </h2>
              <button 
                onClick={() => { setIsAdding(false); setEditingBrand(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm flex items-center space-x-2">
                    <ImageIcon size={18} />
                    <span>Basic Details</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Brand Name</label>
                    <input 
                      type="text"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-900"
                      value={isAdding ? newBrand.name : editingBrand?.name}
                      onChange={(e) => isAdding ? setNewBrand({...newBrand, name: e.target.value}) : setEditingBrand({...editingBrand!, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Image URL / Upload</label>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                         <input 
                          type="text"
                          placeholder="Paste image URL..."
                          className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-sm text-slate-900"
                          value={isAdding ? newBrand.image : editingBrand?.image}
                          onChange={(e) => isAdding ? setNewBrand({...newBrand, image: e.target.value}) : setEditingBrand({...editingBrand!, image: e.target.value})}
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-50 text-blue-600 p-4 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                          <Upload size={20} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </div>
                      <div className="p-2 bg-gray-50 border border-gray-100 rounded-2xl h-32 overflow-hidden">
                        {(isAdding ? newBrand.image : editingBrand?.image) && (
                          <img src={isAdding ? newBrand.image : editingBrand?.image} className="h-full w-full object-cover rounded-xl" alt="Preview" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-slate-900"
                      value={isAdding ? newBrand.description : editingBrand?.description}
                      onChange={(e) => isAdding ? setNewBrand({...newBrand, description: e.target.value}) : setEditingBrand({...editingBrand!, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                {/* Size Finacial Management */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm flex items-center space-x-2">
                    <DollarSign size={18} />
                    <span>Price & Size Management</span>
                  </h3>
                  
                  <div className="flex space-x-2">
                    <input 
                      type="text"
                      placeholder="Add custom size (e.g. 285/35 R21)"
                      className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-slate-900"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSize()}
                    />
                    <button onClick={addCustomSize} className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-slate-800"><Plus size={20} /></button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-2">
                    {/* Combine default and brand-specific sizes */}
                    {Array.from(new Set([...ALL_TYRE_SIZES, ...(isAdding ? newBrand.availableSizes || [] : editingBrand?.availableSizes || [])])).map(size => {
                      const isSelected = isAdding ? newBrand.availableSizes?.includes(size) : editingBrand?.availableSizes?.includes(size);
                      const finance = isAdding ? newBrand.sizeData?.[size] : editingBrand?.sizeData?.[size];
                      
                      return (
                        <div key={size} className={`p-5 rounded-3xl border-2 transition-all ${isSelected ? 'border-blue-500 bg-white' : 'border-gray-100 bg-gray-50/50 opacity-60'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-black text-gray-900">{size}</span>
                            <button 
                              onClick={() => handleToggleSize(isAdding ? newBrand : editingBrand!, size)}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
                            >
                              {isSelected ? <Check size={20} /> : <Plus size={20} />}
                            </button>
                          </div>
                          
                          {isSelected && finance && (
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">Purchase (Rs.)</label>
                                <input 
                                  type="number" 
                                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-slate-900"
                                  value={finance.purchasePrice}
                                  onChange={(e) => handleUpdateFinance(size, 'purchasePrice', Number(e.target.value))}
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">Expenses (Rs.)</label>
                                <input 
                                  type="number" 
                                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-slate-900"
                                  value={finance.otherExpenses}
                                  onChange={(e) => handleUpdateFinance(size, 'otherExpenses', Number(e.target.value))}
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">Sale (Rs.)</label>
                                <input 
                                  type="number" 
                                  className="w-full bg-blue-50 border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-blue-900 font-bold"
                                  value={finance.salePrice}
                                  onChange={(e) => handleUpdateFinance(size, 'salePrice', Number(e.target.value))}
                                />
                              </div>
                              <div className="col-span-3 mt-2 flex justify-between items-center px-2 py-1 bg-gray-100 rounded-lg">
                                <span className="text-[10px] font-bold text-gray-500">Margin:</span>
                                <span className={`text-[10px] font-black ${finance.salePrice - finance.purchasePrice - finance.otherExpenses > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  Rs. {finance.salePrice - finance.purchasePrice - finance.otherExpenses}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end space-x-4">
              <button 
                onClick={() => { setIsAdding(false); setEditingBrand(null); }}
                className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={isAdding ? handleSaveNew : handleSaveEdit}
                className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-xl hover:bg-blue-700 transition-all"
              >
                <Save size={20} />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-[40px] shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-2xl transition-all">
            <div className="aspect-video relative overflow-hidden group">
              <img src={brand.image} alt={brand.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <h3 className="text-2xl font-black text-white">{brand.name}</h3>
              </div>
            </div>
            <div className="p-8 flex-1">
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 italic">"{brand.description}"</p>
              <div className="mb-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Inventory Health</p>
                <div className="flex items-center space-x-3 text-sm">
                   <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, (brand.availableSizes.length / ALL_TYRE_SIZES.length) * 100)}%` }}></div>
                   </div>
                   <span className="font-bold text-gray-900">{brand.availableSizes.length} Sizes</span>
                </div>
              </div>
            </div>
            <div className="p-8 pt-0 flex space-x-4">
              <button 
                onClick={() => setEditingBrand({...brand})}
                className="flex-1 bg-gray-50 text-gray-600 py-3 rounded-2xl font-bold border border-gray-100 hover:bg-gray-100 flex items-center justify-center space-x-2"
              >
                <Edit2 size={16} />
                <span>Manage</span>
              </button>
              <button 
                onClick={() => handleDelete(brand.id)}
                className="bg-red-50 text-red-600 px-5 rounded-2xl font-bold border border-red-100 hover:bg-red-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBrands;
