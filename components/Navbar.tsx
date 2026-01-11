
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { THEMES } from '../constants';
import { ShieldCheck, LogOut, Menu, X, Phone } from 'lucide-react';

const Navbar: React.FC = () => {
  const { settings, isAdmin, logout } = useApp();
  const themeStyles = THEMES[settings.theme];
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogoDoubleClick = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <nav className={`sticky top-0 z-50 shadow-md ${themeStyles.primary} text-white transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with double-click secret */}
          <div 
            className="flex items-center cursor-pointer select-none group"
            onDoubleClick={handleLogoDoubleClick}
          >
            <div className="bg-white p-1.5 rounded-lg mr-2 transition-transform group-hover:scale-105">
              <span className={`font-bold text-xl ${themeStyles.text}`}>GAB</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight">Tyres</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:opacity-80 font-medium transition-opacity">Dashboard</Link>
            <Link to="/brands" className="hover:opacity-80 font-medium transition-opacity">Brands</Link>
            <Link to="/contact" className="hover:opacity-80 font-medium transition-opacity">Contact Us</Link>
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors">
                  <ShieldCheck size={16} />
                  <span>Admin Panel</span>
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center space-x-1 text-red-100 hover:text-white transition-colors"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </>
            )}
            <a 
              href={`https://wa.me/${settings.whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-bold transition-all shadow-sm"
            >
              <Phone size={18} />
              <span>Contact WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${themeStyles.primary} border-t border-white/10 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-300`}>
          <Link to="/" className="block py-2 font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          <Link to="/brands" className="block py-2 font-medium" onClick={() => setIsMenuOpen(false)}>Brands</Link>
          <Link to="/contact" className="block py-2 font-medium" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          {isAdmin && (
            <>
              <Link to="/admin/dashboard" className="block py-2 font-medium text-yellow-300" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
              <button 
                onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }}
                className="block w-full text-left py-2 font-medium text-red-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
