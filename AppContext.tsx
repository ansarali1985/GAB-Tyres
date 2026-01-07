
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

  // 1. Initial Load from Cloud (Global)
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      console.log("Checking Cloud Connection...");
      
      try {
        if (supabase) {
          // Fetch from Supabase
          const [brandsRes, servicesRes, settingsRes] = await Promise.all([
            supabase.from('brands').select('*'),
            supabase.from('services').select('*'),
            supabase.from('settings').select('*').maybeSingle()
          ]);

          if (brandsRes.error) console.error("Cloud Brands Error:", brandsRes.error.message);
          if (servicesRes.error) console.error("Cloud Services Error:", servicesRes.error.message);

          // Only use cloud data if it actually exists in the database
          let cloudDataFound = false;

          if (brandsRes.data && brandsRes.data.length > 0) {
            setBrands(brandsRes.data);
            cloudDataFound = true;
          }
          if (servicesRes.data && servicesRes.data.length > 0) {
            setServices(servicesRes.data);
            cloudDataFound = true;
          }
          if (settingsRes.data) {
            setSettings(settingsRes.data);
            cloudDataFound = true;
          }

          if (cloudDataFound) {
            console.log("Worldwide data synchronized successfully.");
          } else {
            console.log("Cloud is empty. Using default local version.");
            loadFromLocal();
          }
        } else {
          console.warn("Supabase not configured. Using local fallback.");
          loadFromLocal();
        }
      } catch (error) {
        console.error("Critical Sync Error:", error);
        loadFromLocal();
      } finally {
        setIsLoading(false);
      }
    };

    const loadFromLocal = () => {
      const savedBrands = localStorage.getItem('gab_brands');
      const savedServices = localStorage.getItem('gab_services');
      const savedSettings = localStorage.getItem('gab_settings');
      
      if (savedBrands) setBrands(JSON.parse(savedBrands));
      if (savedServices) setServices(JSON.parse(savedServices));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    };

    initData();
  }, []);

  // 2. Local Backup Persistence
  useEffect(() => {
    localStorage.setItem('gab_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('gab_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('gab_settings', JSON.stringify(settings));
  }, [settings]);

  const syncToCloud = async () => {
    if (!supabase) {
      alert("Cloud database not connected. Check Vercel environment variables.");
      return;
    }

    try {
      console.log("Starting Global Sync...");
      
      // 1. Sync Brands
      const { error: bDelErr } = await supabase.from('brands').delete().neq('id', '0');
      if (bDelErr) throw new Error("Brands Delete Failed: " + bDelErr.message);
      const { error: bInsErr } = await supabase.from('brands').insert(brands);
      if (bInsErr) throw new Error("Brands Insert Failed: " + bInsErr.message);

      // 2. Sync Services
      const { error: sDelErr } = await supabase.from('services').delete().neq('id', '0');
      if (sDelErr) throw new Error("Services Delete Failed: " + sDelErr.message);
      const { error: sInsErr } = await supabase.from('services').insert(services);
      if (sInsErr) throw new Error("Services Insert Failed: " + sInsErr.message);

      // 3. Sync Settings
      const { error: setErr } = await supabase.from('settings').upsert({ id: 1, ...settings });
      if (setErr) throw new Error("Settings Sync Failed: " + setErr.message);
      
      alert("GLOBAL UPDATE LIVE! Every device worldwide now sees your latest changes.");
    } catch (e: any) {
      console.error("Sync Error:", e);
      alert("Update Failed: " + e.message + "\n\nMake sure you disabled RLS in Supabase SQL Editor.");
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
