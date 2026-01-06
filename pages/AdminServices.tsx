
import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { ServiceItem } from '../types';
import { Save, Trash2, Plus, Edit2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminServices: React.FC = () => {
  const { isAdmin, services, setServices } = useApp();
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    name: '',
    description: '',
    price: 0,
    icon: '🔧',
    image: ''
  });

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isAdding) {
          setNewService(prev => ({ ...prev, image: base64String }));
        } else if (editingService) {
          setEditingService(prev => prev ? ({ ...prev, image: base64String }) : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? editingService : s));
      setEditingService(null);
    } else {
      if (!newService.name) return;
      const service: ServiceItem = {
        id: Date.now().toString(),
        name: newService.name!,
        description: newService.description || '',
        price: newService.price || 0,
        icon: newService.icon || '🔧',
        image: newService.image
      };
      setServices([...services, service]);
      setIsAdding(false);
      setNewService({ name: '', description: '', price: 0, icon: '🔧', image: '' });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this service permanently?")) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Service Management</h1>
          <p className="text-gray-500 font-medium">Configure dashboard services, rates, and visuals</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-emerald-100 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          <span>Add New Service</span>
        </button>
      </div>

      {(isAdding || editingService) && (
        <div className="mb-12 bg-white p-10 rounded-[40px] shadow-2xl border border-emerald-100 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-gray-900">
              {isAdding ? 'Create New Service' : `Edit ${editingService?.name}`}
            </h2>
            <button onClick={() => { setIsAdding(false); setEditingService(null); }} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service Visuals */}
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Service Image (Upload)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-square rounded-3xl overflow-hidden border-4 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition-all"
              >
                {(isAdding ? newService.image : editingService?.image) ? (
                  <>
                    <img src={isAdding ? newService.image : editingService?.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Upload className="text-white" size={32} />
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <span className="text-[10px] font-bold">CLICK TO UPLOAD</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Service Name</label>
                  <input 
                    type="text"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                    value={isAdding ? newService.name : editingService?.name}
                    onChange={(e) => isAdding ? setNewService({...newService, name: e.target.value}) : setEditingService({...editingService!, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Standard Rate (Rs.)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                    value={isAdding ? newService.price : editingService?.price}
                    onChange={(e) => isAdding ? setNewService({...newService, price: Number(e.target.value)}) : setEditingService({...editingService!, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Default Icon (Emoji)</label>
                  <input 
                    type="text"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all text-center text-2xl text-slate-900"
                    value={isAdding ? newService.icon : editingService?.icon}
                    onChange={(e) => isAdding ? setNewService({...newService, icon: e.target.value}) : setEditingService({...editingService!, icon: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  rows={3}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all text-slate-900"
                  value={isAdding ? newService.description : editingService?.description}
                  onChange={(e) => isAdding ? setNewService({...newService, description: e.target.value}) : setEditingService({...editingService!, description: e.target.value})}
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleSave}
                  className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 transition-all flex items-center space-x-2"
                >
                  <Save size={20} />
                  <span>Save All Service Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Table UI */}
      <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Visual</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Service Item</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Pricing</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-10 py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
                    {service.image ? (
                      <img src={service.image} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{service.icon}</span>
                    )}
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="font-black text-gray-900 text-lg block">{service.name}</span>
                  <span className="text-xs text-gray-400 truncate max-w-xs block italic">{service.description}</span>
                </td>
                <td className="px-10 py-8">
                  <span className="text-2xl font-black text-emerald-600">Rs. {service.price.toLocaleString()}</span>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingService({...service})} className="p-3 bg-white text-gray-600 rounded-xl border border-gray-200 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(service.id)} className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-100 transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminServices;
