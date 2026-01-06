
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TyreBrand, ServiceItem, AppSettings, ThemeType } from './types';
import { INITIAL_BRANDS, INITIAL_SERVICES, DEFAULT_SETTINGS } from './constants';

interface AppContextType {
  brands: TyreBrand[];
  services: ServiceItem[];
  settings: AppSettings;
  isAdmin: boolean;
  setBrands: React.Dispatch<React.SetStateAction<TyreBrand[]>>;
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  login: (u: string, p: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<TyreBrand[]>(() => {
    const saved = localStorage.getItem('gab_brands');
    return saved ? JSON.parse(saved) : INITIAL_BRANDS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('gab_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('gab_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('gab_isAdmin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('gab_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('gab_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('gab_settings', JSON.stringify(settings));
  }, [settings]);

  const login = (u: string, p: string): boolean => {
    if (u === settings.adminUsername && p === settings.adminPassword) {
      setIsAdmin(true);
      sessionStorage.setItem('gab_isAdmin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('gab_isAdmin');
  };

  return (
    <AppContext.Provider value={{
      brands, services, settings, isAdmin,
      setBrands, setServices, setSettings,
      login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
