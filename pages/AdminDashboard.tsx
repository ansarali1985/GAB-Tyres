
import React from 'react';
import { useApp } from '../AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Tag, Wrench, Settings, LogOut, ChevronRight, Package, Users, DollarSign, Calculator, TrendingUp, AlertTriangle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { isAdmin, logout, brands, services } = useApp();
  const navigate = useNavigate();

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  // Financial Calculations for Profitability Report
  let totalPotentialRevenue = 0;
  let totalPurchaseCost = 0;
  let totalOtherExpenses = 0;
  let totalActiveSizes = 0;

  brands.forEach(brand => {
    Object.values(brand.sizeData).forEach(finance => {
      totalPotentialRevenue += finance.salePrice;
      totalPurchaseCost += finance.purchasePrice;
      totalOtherExpenses += finance.otherExpenses;
      totalActiveSizes++;
    });
  });

  const netPotentialMargin = totalPotentialRevenue - totalPurchaseCost - totalOtherExpenses;
  const averageMarginPerUnit = totalActiveSizes > 0 ? netPotentialMargin / totalActiveSizes : 0;

  const menuItems = [
    { name: 'Manage Brands', icon: <Tag />, path: '/admin/brands', desc: 'Add, edit or delete tyre brands', color: 'bg-blue-500' },
    { name: 'Manage Services', icon: <Wrench />, path: '/admin/services', desc: 'Update service prices and details', color: 'bg-emerald-500' },
    { name: 'System Settings', icon: <Settings />, path: '/admin/settings', desc: 'Themes, credentials and business info', color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium">Control center for GAB Tyres business performance</p>
        </div>
        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100 hover:bg-red-100 transition-all"
        >
          <LogOut size={20} />
          <span>Exit Admin Mode</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Package size={24} />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">Active</span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Total Brands</p>
          <h3 className="text-3xl font-black text-gray-900">{brands.length}</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <Wrench size={24} />
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">Steady</span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Services</p>
          <h3 className="text-3xl font-black text-gray-900">{services.length}</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
              <Calculator size={24} />
            </div>
            <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">Managed</span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Stocked Sizes</p>
          <h3 className="text-3xl font-black text-gray-900">{totalActiveSizes}</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">Potential</span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Est. Net Margin</p>
          <h3 className="text-3xl font-black text-gray-900">Rs. {netPotentialMargin.toLocaleString()}</h3>
        </div>
      </div>

      {/* Profitability Report Section */}
      <section className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-10 mb-12">
        <div className="flex items-center space-x-3 mb-8">
          <Calculator className="text-orange-500" size={28} />
          <h2 className="text-2xl font-black text-gray-900">Brief Profitability Report</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Total Potential Sale</span>
            <span className="text-2xl font-black text-gray-900">Rs. {totalPotentialRevenue.toLocaleString()}</span>
          </div>
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Total Purchase Cost</span>
            <span className="text-2xl font-black text-gray-900">Rs. {totalPurchaseCost.toLocaleString()}</span>
          </div>
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
            <span className="text-xs font-black text-orange-400 uppercase tracking-widest block mb-2">Other Operational Expenses</span>
            <span className="text-2xl font-black text-orange-900">Rs. {totalOtherExpenses.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between bg-emerald-900 rounded-[32px] p-10 text-white relative overflow-hidden">
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-3xl font-black mb-2">Net Potential Profit</h3>
            <p className="opacity-70 max-w-sm">Total margin after deducting purchase costs and operational expenses across all brands.</p>
          </div>
          <div className="relative z-10 text-center md:text-right">
            <span className="text-5xl font-black block mb-2">Rs. {netPotentialMargin.toLocaleString()}</span>
            <span className="text-sm font-bold bg-white/20 px-4 py-1.5 rounded-full">Avg. Rs. {Math.round(averageMarginPerUnit).toLocaleString()} / size</span>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        </div>

        {netPotentialMargin <= 0 && totalActiveSizes > 0 && (
          <div className="mt-6 flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100">
            <AlertTriangle size={20} />
            <span className="text-sm font-bold">Warning: Your current pricing leads to a loss or zero profit. Please review Purchase vs Sale prices in Brand Management.</span>
          </div>
        )}
      </section>

      <h2 className="text-2xl font-black text-gray-900 mb-8">Management Areas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {menuItems.map((item) => (
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
