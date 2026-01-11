import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Tag, Wrench, Settings, ArrowLeft } from 'lucide-react';
import { THEMES } from '../constants';
import { useApp } from '../AppContext';

const AdminNavbar: React.FC = () => {
  const { settings } = useApp();
  const themeStyles = THEMES[settings.theme];

  const links = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview' },
    { to: '/admin/brands', icon: <Tag size={18} />, label: 'Brands' },
    { to: '/admin/services', icon: <Wrench size={18} />, label: 'Services' },
    { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-1 md:space-x-4 min-w-max">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? `bg-blue-50 text-blue-600`
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
          <NavLink to="/" className="text-gray-400 hover:text-gray-600 flex items-center space-x-1 text-sm font-bold ml-4 min-w-max">
            <ArrowLeft size={16} />
            <span>Public Site</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
