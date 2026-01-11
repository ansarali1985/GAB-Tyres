import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Tag, Wrench, Settings, LogOut, ChevronRight, 
  Package, Calculator, TrendingUp, Cloud, CloudOff, RefreshCw, 
  BarChart3, PieChart, Info, Layers, Zap, ShieldCheck, Activity,
  ArrowUpRight, DollarSign, Wallet
} from 'lucide-react';
import { db } from '../firebaseConfig';
import { SizeFinance } from '../types';

const AdminDashboard: React.FC = () => {
  const { isAdmin, logout, brands, services, syncToCloud, settings } = useApp();
  const navigate = useNavigate();

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  // Centralized Business Intelligence Engine
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalPurchase = 0;
    let totalExpenses = 0;
    let totalPatterns = 0;
    let totalSizes = 0;

    const brandBreakdown = brands.map(brand => {
      let bRev = 0;
      let bSizes = 0;
      
      brand.patterns.forEach(pattern => {
        totalPatterns++;
        Object.values(pattern.sizeData || {}).forEach(finance => {
          const f = finance as SizeFinance;
          totalRevenue += (f.salePrice || 0);
          totalPurchase += (f.purchasePrice || 0);
          totalExpenses += (f.otherExpenses || 0);
          bRev += (f.salePrice || 0);
          totalSizes++;
          bSizes++;
        });
      });

      return {
        name: brand.name,
        revenue: bRev,
        patterns: brand.patterns.length,
        sizes: bSizes,
        health: bSizes > 0 ? 'Optimal' : 'Needs Data'
      };
    });

    const serviceValue = services.reduce((acc, s) => acc + (s.price || 0), 0);
    const netMargin = totalRevenue - totalPurchase - totalExpenses;
    const roi = totalPurchase > 0 ? (netMargin / totalPurchase) * 100 : 0;

    return {
      totalRevenue,
      totalPurchase,
      totalExpenses,
      totalActiveSizes: totalSizes,
      totalPatterns,
      netMargin,
      serviceValue,
      roi,
      brandBreakdown
    };
  }, [brands, services]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Dynamic Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 gap-8">
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Activity size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px]">Real-time Enterprise Dashboard</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${db ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-xs font-bold text-gray-400">{db ? 'Cloud Synchronized' : 'Local Sandbox Mode'}</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-2">
            GAB <span className="text-blue-600">Analytics.</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-xl">
            Portfolio performance for <span className="text-gray-900 font-bold">{settings.businessName}</span>. 
            Last automated data reconciliation at {new Date().toLocaleTimeString()}.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-right duration-700">
          <button 
            onClick={() => syncToCloud()}
            className="flex items-center space-x-3 px-8 py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95 group"
          >
            <RefreshCw size={22} className="group-active:animate-spin" />
            <span>Force Cloud Sync</span>
          </button>

          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="p-5 bg-white text-red-500 rounded-[24px] border border-red-100 hover:bg-red-50 transition-all shadow-md group"
            title="Secure Logout"
          >
            <LogOut size={26} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid - High Density */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 hover:border-blue-200 transition-colors group">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
              <Package size={32} />
            </div>
            <ArrowUpRight className="text-gray-200 group-hover:text-blue-400" />
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Stocked Brands</p>
          <h3 className="text-4xl font-black text-gray-900">{brands.length}</h3>
          <p className="text-[10px] text-blue-500 font-bold mt-2">Active across {metrics.totalPatterns} patterns</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 hover:border-purple-200 transition-colors group">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
              <Layers size={32} />
            </div>
            <ArrowUpRight className="text-gray-200 group-hover:text-purple-400" />
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">SKU Diversity</p>
          <h3 className="text-4xl font-black text-gray-900">{metrics.totalActiveSizes}</h3>
          <p className="text-[10px] text-purple-500 font-bold mt-2">Unique size combinations</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 hover:border-emerald-200 transition-colors group">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
              <TrendingUp size={32} />
            </div>
            <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">+{metrics.roi.toFixed(1)}% ROI</div>
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Potential Profit</p>
          <h3 className="text-4xl font-black text-gray-900">Rs. {(metrics.netMargin / 1000).toFixed(1)}K</h3>
          <p className="text-[10px] text-emerald-500 font-bold mt-2">After operating expenses</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 hover:border-orange-200 transition-colors group">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
              <Wrench size={32} />
            </div>
            <ArrowUpRight className="text-gray-200 group-hover:text-orange-400" />
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Service Value</p>
          <h3 className="text-4xl font-black text-gray-900">{services.length}</h3>
          <p className="text-[10px] text-orange-500 font-bold mt-2">Rs. {metrics.serviceValue.toLocaleString()} combined</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Detailed Financial Ledger Breakdown */}
        <div className="lg:col-span-2 bg-slate-950 rounded-[48px] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-black flex items-center space-x-3">
                  <BarChart3 className="text-blue-500" size={28} />
                  <span>Financial Ledger</span>
                </h2>
                <p className="text-gray-500 text-sm mt-1 font-medium italic">Projected valuation based on current catalog data</p>
              </div>
              <div className="flex space-x-2">
                <div className="bg-white/5 border border-white/10 p-4 rounded-[24px] text-center min-w-[120px]">
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Net Margin</p>
                  <p className="text-xl font-black text-green-400">Rs. {metrics.netMargin.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              {/* Sales Progress Bar */}
              <div>
                <div className="flex justify-between text-sm font-black mb-4 uppercase tracking-[0.1em]">
                  <span className="text-blue-400 flex items-center"><DollarSign size={14} className="mr-1" /> Total Sales Potential</span>
                  <span>Rs. {metrics.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="h-5 bg-white/5 rounded-full overflow-hidden p-1">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 w-full rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"></div>
                </div>
              </div>

              {/* Sub-costs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                  <div className="flex justify-between text-xs font-black mb-4 uppercase tracking-widest text-red-400">
                    <span className="flex items-center"><Wallet size={12} className="mr-2" /> Purchase Liability</span>
                    <span>Rs. {metrics.totalPurchase.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-1000 ease-out" 
                      style={{ width: `${(metrics.totalPurchase / metrics.totalRevenue) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-4 font-bold">Consumes {((metrics.totalPurchase / metrics.totalRevenue) * 100).toFixed(1)}% of total revenue</p>
                </div>

                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                  <div className="flex justify-between text-xs font-black mb-4 uppercase tracking-widest text-orange-400">
                    <span className="flex items-center"><Zap size={12} className="mr-2" /> Operating Overhead</span>
                    <span>Rs. {metrics.totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all duration-1000 ease-out" 
                      style={{ width: `${(metrics.totalExpenses / metrics.totalRevenue) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-4 font-bold">Accounts for {((metrics.totalExpenses / metrics.totalRevenue) * 100).toFixed(1)}% of potential sales</p>
                </div>
              </div>

              <div className="pt-10 mt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center space-x-4">
                   <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                    <TrendingUp size={30} />
                   </div>
                   <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Calculated Net Yield</p>
                    <p className="text-4xl font-black text-white">Rs. {metrics.netMargin.toLocaleString()}</p>
                   </div>
                </div>
                <div className="text-left md:text-right bg-white/5 px-8 py-4 rounded-[24px] border border-white/10">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Efficiency Score</p>
                  <p className="text-2xl font-black text-white">
                    {((metrics.netMargin / metrics.totalRevenue) * 100).toFixed(1)}% <span className="text-sm font-medium text-gray-500">Margin</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* High Intensity Brand Inventory Health */}
        <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black flex items-center space-x-3">
              <PieChart className="text-blue-600" size={24} />
              <span>Brand Health</span>
            </h2>
            <div className="p-2 bg-slate-50 rounded-xl text-gray-400">
              <Info size={18} />
            </div>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto pr-3 custom-scrollbar">
            {metrics.brandBreakdown.map((stat, idx) => (
              <div key={idx} className="bg-slate-50/50 p-5 rounded-[30px] border border-transparent hover:border-blue-100 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-blue-600 shadow-sm border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {stat.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 leading-none mb-1">{stat.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        {stat.patterns} Models • {stat.sizes} Active Sizes
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${stat.health === 'Optimal' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {stat.health}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100/50">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share Value</p>
                   <p className="font-black text-gray-900">Rs. {(stat.revenue / 1000).toFixed(1)}K</p>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${(stat.revenue / metrics.totalRevenue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {metrics.brandBreakdown.length === 0 && (
              <div className="text-center py-16 flex flex-col items-center">
                <Package size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold italic">Brand inventory is currently empty</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => navigate('/admin/brands')}
            className="mt-8 w-full py-5 bg-slate-900 text-white rounded-[24px] font-black flex items-center justify-center space-x-3 hover:bg-blue-600 transition-all shadow-xl active:scale-95"
          >
            <Tag size={20} />
            <span>Optimize Brands</span>
          </button>
        </div>
      </div>

      {/* Strategic Command Areas */}
      <div className="px-2">
        <h2 className="text-3xl font-black text-gray-900 mb-10 flex items-center space-x-3">
          <ShieldCheck className="text-blue-600" size={32} />
          <span>Strategic Command Areas</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: 'Brand Intelligence', 
              icon: <Tag size={28} />, 
              path: '/admin/brands', 
              desc: 'Define market presence, tyre patterns, and size-specific financial logic.', 
              color: 'bg-blue-600', 
              glow: 'shadow-blue-200',
              accent: 'text-blue-100'
            },
            { 
              name: 'Service Logistics', 
              icon: <Wrench size={28} />, 
              path: '/admin/services', 
              desc: 'Manage service pricing, workshop capability descriptions, and service icons.', 
              color: 'bg-emerald-600', 
              glow: 'shadow-emerald-200',
              accent: 'text-emerald-100'
            },
            { 
              name: 'System Framework', 
              icon: <Settings size={28} />, 
              path: '/admin/settings', 
              desc: 'Global themes, security credentials, business contact info, and SEO content.', 
              color: 'bg-purple-600', 
              glow: 'shadow-purple-200',
              accent: 'text-purple-100'
            },
          ].map((item) => (
            <div 
              key={item.name}
              onClick={() => navigate(item.path)}
              className="group cursor-pointer bg-white p-12 rounded-[56px] shadow-xl border border-gray-50 hover:shadow-2xl transition-all hover:-translate-y-3 relative overflow-hidden"
            >
              <div className={`w-20 h-20 ${item.color} text-white rounded-[28px] flex items-center justify-center mb-10 shadow-2xl ${item.glow} transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                {item.icon}
              </div>
              <h3 className="text-3xl font-black mb-4 text-gray-900 tracking-tight">{item.name}</h3>
              <p className="text-gray-500 leading-relaxed mb-10 font-medium text-base">{item.desc}</p>
              
              <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                <span className="text-blue-600 font-black text-sm tracking-widest uppercase">Open Module</span>
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight size={24} />
                </div>
              </div>
              
              {/* Card Design Detail */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
