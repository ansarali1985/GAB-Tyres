import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { ALL_TYRE_SIZES } from '../constants';
import { TyreBrand, SizeFinance } from '../types';
import { Plus, Trash2, Edit2, X, Check, Save, Upload, Image as ImageIcon, DollarSign, ListFilter } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminBrands: React.FC = () => {
  const { isAdmin, brands, setBrands } = useApp();
  const [editingBrand, setEditingBrand] = useState<TyreBrand | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const [newPattern, setNewPattern] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newBrand, setNewBrand] = useState<Partial<TyreBrand>>({
    name: '',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400',
    description: '',
    availableSizes: [],
    patterns: [],
    sizeData: {}
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

  const handleToggleSize = (brand: Partial<TyreBrand>, size: string) => {
    const currentSizes = brand.availableSizes || [];
    const currentData = brand.sizeData || {};
    let updatedSizes = currentSizes.includes(size) ? currentSizes.filter(s => s !== size) : [...currentSizes, size];
    let updatedData = { ...currentData };
    if (!currentSizes.includes(size)) updatedData[size] = { salePrice: 0, purchasePrice: 0, otherExpenses: 0 };
    else delete updatedData[size];
    
    if (editingBrand) setEditingBrand({ ...editingBrand, availableSizes: updatedSizes, sizeData: updatedData });
    else setNewBrand({ ...newBrand, availableSizes: updatedSizes, sizeData: updatedData });
  };

  const addPattern = () => {
    if (!newPattern.trim()) return;
    const brand = isAdding ? newBrand : editingBrand;
    if (!brand) return;
    const current = brand.patterns || [];
    const updated = [...current, newPattern.trim()];
    if (isAdding) setNewBrand({ ...newBrand, patterns: updated });
    else setEditingBrand({ ...editingBrand!, patterns: updated });
    setNewPattern('');
  };

  const removePattern = (p: string) => {
    const brand = isAdding ? newBrand : editingBrand;
    if (!brand) return;
    const updated = (brand.patterns || []).filter(item => item !== p);
    if (isAdding) setNewBrand({ ...newBrand, patterns: updated });
    else setEditingBrand({ ...editingBrand!, patterns: updated });
  };

  const handleSaveNew = () => {
    if (!newBrand.name) return alert("Name is required");
    const brand: TyreBrand = {
      id: Date.now().toString(),
      name: newBrand.name!,
      image: newBrand.image || '',
      description: newBrand.description || '',
      availableSizes: newBrand.availableSizes || [],
      patterns: newBrand.patterns || [],
      sizeData: newBrand.sizeData || {}
    };
    setBrands([...brands, brand]);
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (!editingBrand) return;
    setBrands(brands.map(b => b.id === editingBrand.id ? editingBrand : b));
    setEditingBrand(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-gray-900">Brand Management</h1>
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Brand</span>
        </button>
      </div>

      {(isAdding || editingBrand) && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col p-8">
            <div className="flex justify-between mb-8">
              <h2 className="text-2xl font-black">Edit Brand Details</h2>
              <button onClick={() => { setIsAdding(false); setEditingBrand(null); }}><X size={28} /></button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Basic Info</label>
                  <input placeholder="Name" className="w-full bg-gray-50 border p-4 rounded-xl" value={isAdding ? newBrand.name : editingBrand?.name} onChange={e => isAdding ? setNewBrand({...newBrand, name: e.target.value}) : setEditingBrand({...editingBrand!, name: e.target.value})} />
                  <textarea placeholder="Description" className="w-full bg-gray-50 border p-4 rounded-xl" value={isAdding ? newBrand.description : editingBrand?.description} onChange={e => isAdding ? setNewBrand({...newBrand, description: e.target.value}) : setEditingBrand({...editingBrand!, description: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Patterns / Models</label>
                  <div className="flex space-x-2">
                    <input placeholder="Add pattern (e.g. Pilot Sport 4)" className="flex-1 bg-gray-50 border p-4 rounded-xl" value={newPattern} onChange={e => setNewPattern(e.target.value)} onKeyPress={e => e.key === 'Enter' && addPattern()} />
                    <button onClick={addPattern} className="bg-blue-600 text-white p-4 rounded-xl"><Plus /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(isAdding ? newBrand.patterns : editingBrand?.patterns)?.map(p => (
                      <div key={p} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl flex items-center space-x-2 border border-blue-100">
                        <span className="font-bold text-sm">{p}</span>
                        <button onClick={() => removePattern(p)} className="text-blue-400 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={isAdding ? handleSaveNew : handleSaveEdit} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold flex items-center space-x-2">
                <Save size={20} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {brands.map(brand => (
          <div key={brand.id} className="bg-white rounded-[40px] shadow-lg overflow-hidden border border-gray-100">
            <img src={brand.image} className="w-full h-48 object-cover" alt={brand.name} />
            <div className="p-8">
              <h3 className="text-2xl font-black mb-2">{brand.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{brand.description}</p>
              <div className="flex flex-wrap gap-1 mb-6">
                {brand.patterns?.slice(0, 3).map(p => (
                  <span key={p} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold">{p}</span>
                ))}
              </div>
              <button onClick={() => setEditingBrand({...brand})} className="w-full bg-blue-50 text-blue-600 py-3 rounded-2xl font-bold border border-blue-100 flex items-center justify-center space-x-2">
                <Edit2 size={16} />
                <span>Manage Brand</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBrands;
