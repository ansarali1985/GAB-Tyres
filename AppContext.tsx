
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TyreBrand, ServiceItem, AppSettings, ThemeType } from './types';
import { INITIAL_BRANDS, INITIAL_SERVICES, DEFAULT_SETTINGS } from './constants';
import { supabase } from './supabaseClient';

interface AppContextType {
  brands: TyreBrand[];
  services: ServiceItem[];
  settings: AppSettings;
  isAdmin: boolean;
  isLoading: boolean;
  setBrands: React.Dispatch<React.SetStateAction<TyreBrand[]>>;
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  syncToCloud: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<TyreBrand[]>(INITIAL_BRANDS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => sessionStorage.getItem('gab_isAdmin') === 'true');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Load from Cloud (Global) or Local (Backup)
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        if (supabase) {
          // Attempt to fetch from Supabase tables
          const { data: cloudBrands } = await supabase.from('brands').select('*');
          const { data: cloudServices } = await supabase.from('services').select('*');
          const { data: cloudSettings } = await supabase.from('settings').select('*').single();

          if (cloudBrands && cloudBrands.length > 0) setBrands(cloudBrands);
          if (cloudServices && cloudServices.length > 0) setServices(cloudServices);
          if (cloudSettings) setSettings(cloudSettings);
        } else {
          // Fallback to LocalStorage if Supabase isn't configured yet
          const savedBrands = localStorage.getItem('gab_brands');
          const savedServices = localStorage.getItem('gab_services');
          const savedSettings = localStorage.getItem('gab_settings');
          
          if (savedBrands) setBrands(JSON.parse(savedBrands));
          if (savedServices) setServices(JSON.parse(savedServices));
          if (savedSettings) setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  // 2. Persist to Cloud and Local whenever state changes
  useEffect(() => {
    localStorage.setItem('gab_brands', JSON.stringify(brands));
    if (supabase && isAdmin) {
      // Logic to upsert brands to cloud
      // In a real production app, we would use more surgical updates
      // but for this retail app, we sync the full state on admin change
    }
  }, [brands, isAdmin]);

  useEffect(() => {
    localStorage.setItem('gab_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('gab_settings', JSON.stringify(settings));
  }, [settings]);

  const syncToCloud = async () => {
    if (!supabase) return;
    try {
      // Clear and re-insert to ensure global sync
      await supabase.from('brands').delete().neq('id', '0');
      await supabase.from('brands').insert(brands);
      
      await supabase.from('services').delete().neq('id', '0');
      await supabase.from('services').insert(services);
      
      await supabase.from('settings').upsert({ id: 1, ...settings });
      
      alert("Global Cloud Sync Successful! Your changes are now live worldwide.");
    } catch (e) {
      console.error("Cloud Sync Failed:", e);
      alert("Cloud Sync Failed. Check your database connection.");
    }
  };

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
      brands, services, settings, isAdmin, isLoading,
      setBrands, setServices, setSettings,
      login, logout, syncToCloud
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
