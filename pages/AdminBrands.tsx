import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { ALL_TYRE_SIZES } from '../constants';
import { TyreBrand, TyrePattern, SizeFinance } from '../types';
import { Plus, Trash2, Edit2, X, Save, Upload, Image as ImageIcon, DollarSign, LayoutGrid, ChevronRight, Settings2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminBrands: React.FC = () => {
  const { isAdmin, brands, setBrands } = useApp();
  const [editingBrand, setEditingBrand] = useState<TyreBrand | null>(null);
  const [editingPattern, setEditingPattern] = useState<TyrePattern | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPatternName, setNewPatternName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newBrand, setNewBrand] = useState<Partial<TyreBrand>>({
    name: '',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400',
    description: '',
    patterns: []
  });

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isAdding) setNewBrand(prev => ({ ...prev, image: base64String }));
        else if (editingBrand) setEditingBrand(prev => prev ? ({ ...prev, image: base64String }) : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPattern = () => {
    if (!newPatternName.trim()) return;
    const pattern: TyrePattern = {
      id: Date.now().toString(),
      name: newPatternName.trim(),
      availableSizes: [],
      sizeData: {}
    };

    if (isAdding) {
      setNewBrand({ ...newBrand, patterns: [...(newBrand.patterns || []), pattern] });
    } else if (editingBrand) {
      setEditingBrand({ ...editingBrand, patterns: [...editingBrand.patterns, pattern] });
    }
    setNewPatternName('');
  };

  const removePattern = (id: string) => {
    if (!confirm("Remove this pattern and all its pricing data?")) return;
    if (isAdding) {
      setNewBrand({ ...newBrand, patterns: (newBrand.patterns || []).filter(p => p.id !== id) });
    } else if (editingBrand) {
      setEditingBrand({ ...editingBrand, patterns: editingBrand.patterns.filter(p => p.id !== id) });
    }
  };

  const handleTogglePatternSize = (size: string) => {
    if (!editingPattern) return;
    const currentSizes = editingPattern.availableSizes || [];
    const currentData = editingPattern.sizeData || {};
    
    let updatedSizes = currentSizes.includes(size) ? currentSizes.filter(s => s !== size) : [...currentSizes, size];
    let updatedData = { ...currentData };
    
    if (!currentSizes.includes(size)) {
      updatedData[size] = { salePrice: 0, purchasePrice: 0, otherExpenses: 0 };
    } else {
      delete updatedData[size];
    }
    
    setEditingPattern({ ...editingPattern, availableSizes: updatedSizes, sizeData: updatedData });
  };

  const updatePatternFinance = (size: string, field: keyof SizeFinance, value: number) => {
    if (!editingPattern) return;
    setEditingPattern({
      ...editingPattern,
      sizeData: {
        ...editingPattern.sizeData,
        [size]: {
          ...editingPattern.sizeData[size],
          [field]: value
        }
      }
    });
  };

  const savePatternChanges = () => {
    if (!editingPattern || !editingBrand) return;
    const updatedPatterns = editingBrand.patterns.map(p => p.id === editingPattern.id ? editingPattern : p);
    setEditingBrand({ ...editingBrand, patterns: updatedPatterns });
    setEditingPattern(null);
  };

  const handleSaveBrand = () => {
    const brandToSave = isAdding ? {
      ...newBrand,
      id: Date.now().toString(),
      patterns: newBrand.patterns || []
    } as TyreBrand : editingBrand;

    if (!brandToSave?.name) return alert("Brand name is required");

    if (isAdding) {
      setBrands([...brands, brandToSave]);
    } else {
      setBrands(brands.map(b => b.id === brandToSave.id ? brandToSave : b));
    }
    
    setIsAdding(false);
    setEditingBrand(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-gray-900">Brand Management</h1>
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-xl hover:scale-105 transition-all">
          <Plus size={20} />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Main Brand Modal */}
      {(isAdding || editingBrand) && !editingPattern && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col p-10">
            <div className="flex justify-between mb-8 border-b pb-6">
              <div>
                <h2 className="text-3xl font-black">{isAdding ? 'New Brand Profile' : `Settings: ${editingBrand?.name}`}</h2>
                <p className="text-gray-400 font-medium text-sm">Manage basic info and pattern directory</p>
              </div>
              <button onClick={() => { setIsAdding(false); setEditingBrand(null); }} className="text-gray-400 hover:text-gray-900"><X size={32} /></button>
            </div>

            <div className="overflow-y-auto flex-1 pr-4 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div onClick={() => fileInputRef.current?.click()} className="relative aspect-video rounded-3xl overflow-hidden border-4 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-all">
                    <img src={isAdding ? newBrand.image : editingBrand?.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Upload className="text-white" size={32} />
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Brand Name</label>
                    <input className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold text-lg focus:border-blue-500 outline-none" value={isAdding ? newBrand.name : editingBrand?.name} onChange={e => isAdding ? setNewBrand({...newBrand, name: e.target.value}) : setEditingBrand({...editingBrand!, name: e.target.value})} />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Tyre Models (Patterns)</label>
                  <div className="flex space-x-2">
                    <input placeholder="Add pattern (e.g. Primacy 4)" className="flex-1 bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-blue-500" value={newPatternName} onChange={e => setNewPatternName(e.target.value)} onKeyPress={e => e.key === 'Enter' && addPattern()} />
                    <button onClick={addPattern} className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg"><Plus /></button>
                  </div>
                  <div className="space-y-3">
                    {(isAdding ? newBrand.patterns : editingBrand?.patterns)?.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded-2xl group hover:border-blue-200 transition-all">
                        <div className="flex items-center space-x-3">
                          <LayoutGrid size={18} className="text-gray-300" />
                          <span className="font-bold text-gray-800">{p.name}</span>
                          <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-black uppercase">{p.availableSizes.length} Sizes</span>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isAdding && (
                            <button onClick={() => setEditingPattern(p)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors">
                              <Settings2 size={16} />
                            </button>
                          )}
                          <button onClick={() => removePattern(p.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(isAdding ? newBrand.patterns : editingBrand?.patterns)?.length === 0 && (
                      <p className="text-center text-gray-400 italic text-sm py-4">No patterns added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t flex justify-end">
              <button onClick={handleSaveBrand} className="bg-black text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2">
                <Save size={24} />
                <span>Finalize Brand Setup</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Specific Size/Price Modal */}
      {editingPattern && (
        <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col p-10">
             <div className="flex justify-between mb-8 border-b pb-6">
              <div>
                <h2 className="text-3xl font-black">{editingPattern.name} - Pricing Table</h2>
                <p className="text-gray-400 font-medium">Define sizes and financial data for this specific model</p>
              </div>
              <button onClick={() => setEditingPattern(null)} className="text-gray-400 hover:text-gray-900"><X size={32} /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 overflow-hidden flex-1">
              {/* Size Selector */}
              <div className="lg:col-span-1 border-r pr-8 overflow-y-auto">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Available Sizes</label>
                <div className="grid grid-cols-1 gap-2">
                  {ALL_TYRE_SIZES.map(size => {
                    const isSelected = editingPattern.availableSizes.includes(size);
                    return (
                      <button 
                        key={size}
                        onClick={() => handleTogglePatternSize(size)}
                        className={`text-left p-4 rounded-2xl font-bold transition-all border ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-blue-200'}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Editor */}
              <div className="lg:col-span-2 overflow-y-auto pr-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Pricing Matrix</label>
                <div className="space-y-4">
                  {editingPattern.availableSizes.map(size => (
                    <div key={size} className="bg-white border-2 border-gray-100 p-6 rounded-[32px] shadow-sm animate-in slide-in-from-right duration-300">
                      <div className="flex justify-between items-center mb-6">
                         <span className="text-xl font-black text-blue-600">{size}</span>
                         <button onClick={() => handleTogglePatternSize(size)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Sale Price (PKR)</label>
                          <input type="number" className="w-full bg-gray-50 border rounded-xl p-3 font-bold" value={editingPattern.sizeData[size]?.salePrice || 0} onChange={e => updatePatternFinance(size, 'salePrice', Number(e.target.value))} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Purchase Price</label>
                          <input type="number" className="w-full bg-gray-50 border rounded-xl p-3 font-bold" value={editingPattern.sizeData[size]?.purchasePrice || 0} onChange={e => updatePatternFinance(size, 'purchasePrice', Number(e.target.value))} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Other Expenses</label>
                          <input type="number" className="w-full bg-gray-50 border rounded-xl p-3 font-bold" value={editingPattern.sizeData[size]?.otherExpenses || 0} onChange={e => updatePatternFinance(size, 'otherExpenses', Number(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {editingPattern.availableSizes.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
                      <p className="text-gray-400 font-bold">Select sizes from the left to manage prices.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

             <div className="mt-8 pt-8 border-t flex justify-end">
              <button onClick={savePatternChanges} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl flex items-center space-x-2">
                <Save size={24} />
                <span>Confirm Pattern Pricing</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {brands.map(brand => (
          <div key={brand.id} className="bg-white rounded-[40px] shadow-lg overflow-hidden border border-gray-100 group">
            <div className="h-48 overflow-hidden relative">
              <img src={brand.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={brand.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute bottom-4 left-6 text-white font-black text-2xl">{brand.name}</span>
            </div>
            <div className="p-8">
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 italic">{brand.description}</p>
              
              <div className="mb-8">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Stored Patterns</label>
                <div className="flex flex-wrap gap-2">
                  {brand.patterns.length > 0 ? brand.patterns.map(p => (
                    <span key={p.id} className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-lg font-black uppercase tracking-tighter">
                      {p.name} ({p.availableSizes.length})
                    </span>
                  )) : <span className="text-xs text-gray-300">No patterns defined</span>}
                </div>
              </div>

              <button onClick={() => setEditingBrand({...brand})} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors shadow-lg">
                <Edit2 size={16} />
                <span>Manage Brand Models</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBrands;
