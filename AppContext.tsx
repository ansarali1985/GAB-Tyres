import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TyreBrand, ServiceItem, AppSettings } from './types';
import { INITIAL_BRANDS, INITIAL_SERVICES, DEFAULT_SETTINGS } from './constants';
import { db } from './firebaseConfig';
import { ref, set, onValue } from "firebase/database";

interface AppContextType {
  brands: TyreBrand[];
  services: ServiceItem[];
  settings: AppSettings;
  isAdmin: boolean;
  isLoading: boolean;
  setBrands: (b: TyreBrand[]) => void;
  setServices: (s: ServiceItem[]) => void;
  setSettings: (st: AppSettings) => void;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  syncToCloud: (customData?: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brands, _setBrands] = useState<TyreBrand[]>(INITIAL_BRANDS);
  const [services, _setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [settings, _setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => sessionStorage.getItem('gab_isAdmin') === 'true');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load Data from Firebase (One-way: Cloud -> Local)
  useEffect(() => {
    if (!db) {
      console.warn("Firebase not configured yet.");
      setIsLoading(false);
      return;
    }

    const dataRef = ref(db, 'businessData');
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.brands) _setBrands(data.brands);
        if (data.services) _setServices(data.services);
        if (data.settings) _setSettings(data.settings);
        console.log("Worldwide Data Synced via Firebase.");
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firebase Read Error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync to Cloud Function
  const syncToCloud = async (customData?: any) => {
    if (!db) return;

    try {
      const dataToPush = customData || {
        brands,
        services,
        settings,
        lastUpdated: new Date().toISOString()
      };

      await set(ref(db, 'businessData'), dataToPush);
      console.log("Cloud Push Successful");
    } catch (e: any) {
      console.error("Firebase Sync Error:", e);
    }
  };

  // Wrapper functions to ensure admin changes sync immediately
  const setBrands = (newBrands: TyreBrand[]) => {
    _setBrands(newBrands);
    if (isAdmin) syncToCloud({ brands: newBrands, services, settings, lastUpdated: new Date().toISOString() });
  };

  const setServices = (newServices: ServiceItem[]) => {
    _setServices(newServices);
    if (isAdmin) syncToCloud({ brands, services: newServices, settings, lastUpdated: new Date().toISOString() });
  };

  const setSettings = (newSettings: AppSettings) => {
    _setSettings(newSettings);
    if (isAdmin) syncToCloud({ brands, services, settings: newSettings, lastUpdated: new Date().toISOString() });
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
