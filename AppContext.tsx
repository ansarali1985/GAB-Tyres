
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TyreBrand, ServiceItem, AppSettings } from './types';
import { INITIAL_BRANDS, INITIAL_SERVICES, DEFAULT_SETTINGS } from './constants';
import { db } from './firebaseConfig';
import { ref, set, get, onValue } from "firebase/database";

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

  // 1. Load Data from Firebase
  useEffect(() => {
    if (!db) {
      console.warn("Firebase not configured yet.");
      setIsLoading(false);
      return;
    }

    const dataRef = ref(db, 'businessData');
    
    // This creates a "Live" connection. If you change data in Firebase, 
    // it updates on every user's screen instantly.
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.brands) setBrands(data.brands);
        if (data.services) setServices(data.services);
        if (data.settings) setSettings(data.settings);
        console.log("Worldwide Data Synced via Firebase.");
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firebase Read Error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Local Backup (just in case)
  useEffect(() => {
    localStorage.setItem('gab_brands', JSON.stringify(brands));
    localStorage.setItem('gab_services', JSON.stringify(services));
    localStorage.setItem('gab_settings', JSON.stringify(settings));
  }, [brands, services, settings]);

  const syncToCloud = async () => {
    if (!db) {
      alert("Firebase not connected. Please add your VITE_FIREBASE keys to Vercel.");
      return;
    }

    try {
      // With Firebase, we just push the whole object. No tables needed!
      await set(ref(db, 'businessData'), {
        brands,
        services,
        settings,
        lastUpdated: new Date().toISOString()
      });
      
      alert("GLOBAL UPDATE SUCCESSFUL! Your new prices and brands are now live on every device in the world.");
    } catch (e: any) {
      console.error("Firebase Sync Error:", e);
      alert("Sync Failed: " + e.message + "\nCheck if your Firebase Rules are set to public.");
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
