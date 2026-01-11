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

const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center">
    <div className="bg-blue-600 p-4 rounded-3xl mb-8 animate-bounce shadow-2xl shadow-blue-200">
      <span className="text-white font-black text-4xl">GAB</span>
    </div>
    <div className="flex items-center space-x-3 text-slate-400 font-bold">
      <RefreshCw className="animate-spin" size={20} />
      <span>Synchronizing worldwide data...</span>
    </div>
  </div>
);

const Footer: React.FC = () => {
  const { settings } = useApp();
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-blue-600 text-white p-1 rounded font-bold text-xl">GAB</div>
            <span className="text-white text-xl font-black">{settings.businessName.split(' ')[1] || 'Tyres'}</span>
          </div>
          <p className="max-w-sm mb-8 leading-relaxed">{settings.footerDescription}</p>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Quick Links</h4>
          <ul className="space-y-4">
            {settings.footerQuickLinks.map(link => (
              <li key={link.id}><a href={link.url} className="hover:text-blue-500 transition-colors">{link.label}</a></li>
            ))}
          </ul>
        </div>
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
  const { isLoading } = useApp();
  if (isLoading) return <LoadingScreen />;
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
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
