import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Home from './pages/Home';
import Brands from './pages/Brands';
import BrandDetail from './pages/BrandDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminBrands from './pages/AdminBrands';
import AdminServices from './pages/AdminServices';
import AdminSettings from './pages/AdminSettings';
import { RefreshCw } from 'lucide-react';
import { THEMES } from './constants';
import { ThemeType } from './types';

const LoadingScreen: React.FC = () => {
  const { settings } = useApp();
  const themeStyles = THEMES[settings?.theme || ThemeType.DEFAULT];
  
  return (
    <div className={`fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center transition-colors duration-500`}>
      <div className={`${themeStyles.primary} p-4 rounded-3xl mb-8 animate-bounce shadow-2xl transition-all duration-500`}>
        <span className="text-white font-black text-4xl">GAB</span>
      </div>
      <div className={`flex items-center space-x-3 ${themeStyles.text} font-bold animate-pulse`}>
        <RefreshCw className="animate-spin" size={20} />
        <span>Synchronizing worldwide data...</span>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  const { settings } = useApp();
  const themeStyles = THEMES[settings.theme];
  
  // Dynamic themed dark backgrounds for the footer
  const getFooterBg = () => {
    switch (settings.theme) {
      case ThemeType.LUXURY: return 'bg-stone-950';
      case ThemeType.VIBRANT: return 'bg-rose-950';
      case ThemeType.NATURE: return 'bg-teal-950';
      case ThemeType.DARK: return 'bg-black';
      default: return 'bg-slate-950';
    }
  };

  const hoverClass = themeStyles.accent.replace('text-', 'hover:text-');

  return (
    <footer className={`${getFooterBg()} text-gray-400 py-16 px-4 transition-colors duration-700 border-t border-white/5`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6 group cursor-default">
            <div className="bg-white p-1 rounded font-bold text-xl transition-transform group-hover:scale-110">
              <span className={`${themeStyles.text} transition-colors duration-500`}>GAB</span>
            </div>
            <span className="text-white text-xl font-black">{settings.businessName.split(' ')[1] || 'Tyres'}</span>
          </div>
          <p className="max-w-sm mb-8 leading-relaxed opacity-70 italic">{settings.footerDescription}</p>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 opacity-50">Quick Links</h4>
          <ul className="space-y-4">
            {settings.footerQuickLinks.map(link => (
              <li key={link.id}>
                <a 
                  href={link.url} 
                  className={`${hoverClass} transition-colors duration-300 font-medium`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 opacity-50">Business Info</h4>
          <div className="space-y-2 text-sm">
            <p className="text-white font-bold">{settings.businessName}</p>
            <p className="opacity-60">{settings.businessAddress}</p>
            <p className={`${themeStyles.accent} font-bold mt-4`}>{settings.phoneNumber}</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium opacity-40 uppercase tracking-tighter">
        <p>&copy; {new Date().getFullYear()} {settings.businessName}. All Rights Reserved.</p>
        <p>Premium Performance Solutions</p>
      </div>
    </footer>
  );
};

const AdminLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
  return (
    <>
      {isAdminPath && <AdminNavbar />}
      {children}
    </>
  );
};

const AppContent: React.FC = () => {
  const { isLoading, settings } = useApp();
  
  if (isLoading) return <LoadingScreen />;

  // Theme-aware selection colors
  const getSelectionStyles = () => {
    switch (settings.theme) {
      case ThemeType.LUXURY: return 'selection:bg-amber-200 selection:text-amber-900';
      case ThemeType.VIBRANT: return 'selection:bg-red-200 selection:text-red-900';
      case ThemeType.NATURE: return 'selection:bg-emerald-200 selection:text-emerald-900';
      case ThemeType.DARK: return 'selection:bg-zinc-700 selection:text-white';
      default: return 'selection:bg-blue-200 selection:text-blue-900';
    }
  };

  return (
    <Router>
      <div className={`min-h-screen bg-slate-50 flex flex-col font-sans ${getSelectionStyles()} transition-colors duration-500`}>
        <Navbar />
        <AdminLayoutWrapper>
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/brands/:brandId" element={<BrandDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/brands" element={<AdminBrands />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </AdminLayoutWrapper>
        <Footer />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
