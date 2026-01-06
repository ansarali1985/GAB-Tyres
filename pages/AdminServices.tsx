
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ServiceItem } from '../types';
import { Save, Trash2, Plus, Edit2, X } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminServices: React.FC = () => {
  const { isAdmin, services, setServices } = useApp();
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    name: '',
    description: '',
    price: 0,
    icon: '🔧'
  });

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

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
        icon: newService.icon || '🔧'
      };
      setServices([...services, service]);
      setIsAdding(false);
      setNewService({ name: '', description: '', price: 0, icon: '🔧' });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this service?")) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Service Management</h1>
          <p className="text-gray-500 font-medium">Update rates and descriptions for your services</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price (Rs.)</label>
              <input 
                type="number"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                value={isAdding ? newService.price : editingService?.price}
                onChange={(e) => isAdding ? setNewService({...newService, price: Number(e.target.value)}) : setEditingService({...editingService!, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Icon (Emoji)</label>
              <input 
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all text-center text-2xl text-slate-900"
                value={isAdding ? newService.icon : editingService?.icon}
                onChange={(e) => isAdding ? setNewService({...newService, icon: e.target.value}) : setEditingService({...editingService!, icon: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleSave}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
              >
                <Save size={20} />
                <span>Save</span>
              </button>
            </div>
            <div className="md:col-span-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all text-slate-900"
                value={isAdding ? newService.description : editingService?.description}
                onChange={(e) => isAdding ? setNewService({...newService, description: e.target.value}) : setEditingService({...editingService!, description: e.target.value})}
              ></textarea>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Service</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Rate</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Description</th>
              <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{service.icon}</span>
                    <span className="font-bold text-gray-900 text-lg">{service.name}</span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="text-2xl font-black text-emerald-600">Rs. {service.price}</span>
                </td>
                <td className="px-10 py-8 text-gray-500 max-w-md truncate">
                  {service.description}
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingService({...service})}
                      className="p-3 bg-white text-gray-600 rounded-xl border border-gray-200 hover:border-emerald-400 hover:text-emerald-600 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
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
