import React from 'react';
import { useApp } from '../AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Tag, Wrench, Settings, LogOut, ChevronRight, Package, Calculator, TrendingUp, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { db } from '../firebaseConfig';

const AdminDashboard: React.FC = () => {
  const { isAdmin, logout, brands, services, syncToCloud } = useApp();
  const navigate = useNavigate();

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  let totalPotentialRevenue = 0;
  let totalPurchaseCost = 0;
  let totalOtherExpenses = 0;
  let totalActiveSizes = 0;

  brands.forEach(brand => {
    Object.values(brand.sizeData || {}).forEach(finance => {
      totalPotentialRevenue += finance.salePrice || 0;
      totalPurchaseCost += finance.purchasePrice || 0;
      totalOtherExpenses += finance.otherExpenses || 0;
      totalActiveSizes++;
    });
  });

  const netPotentialMargin = totalPotentialRevenue - totalPurchaseCost - totalOtherExpenses;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium">Firebase Real-time Control Center</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold ${db ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
            {db ? <Cloud size={14} /> : <CloudOff size={14} />}
            <span>{db ? 'Firebase Connected' : 'Local Mode'}</span>
          </div>
          
          <button 
            onClick={() => syncToCloud()}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <RefreshCw size={20} />
            <span>Push Global Update</span>
          </button>

          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100 hover:bg-red-100 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Package size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Total Brands</p>
          <h3 className="text-3xl font-black text-gray-900">{brands.length}</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <Wrench size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Services</p>
          <h3 className="text-3xl font-black text-gray-900">{services.length}</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
              <Calculator size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Stocked Sizes</p>
          <h3 className="text-3xl font-black text-gray-900">{totalActiveSizes}</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Est. Net Margin</p>
          <h3 className="text-3xl font-black text-gray-900">Rs. {netPotentialMargin.toLocaleString()}</h3>
        </div>
      </div>

      <h2 className="text-2xl font-black text-gray-900 mb-8">Management Areas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Manage Brands', icon: <Tag />, path: '/admin/brands', desc: 'Add, edit or delete tyre brands', color: 'bg-blue-500' },
          { name: 'Manage Services', icon: <Wrench />, path: '/admin/services', desc: 'Update service prices and details', color: 'bg-emerald-500' },
          { name: 'System Settings', icon: <Settings />, path: '/admin/settings', desc: 'Themes, credentials and business info', color: 'bg-purple-500' },
        ].map((item) => (
          <div 
            key={item.name}
            onClick={() => navigate(item.path)}
            className="group cursor-pointer bg-white p-10 rounded-[40px] shadow-lg border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2"
          >
            <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:scale-110`}>
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.name}</h3>
            <p className="text-gray-500 leading-relaxed mb-8">{item.desc}</p>
            <div className="flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
              <span>Enter Management</span>
              <ChevronRight size={18} className="ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
