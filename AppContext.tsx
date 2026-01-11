import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TyreBrand, ServiceItem, AppSettings } from './types';
import { INITIAL_BRANDS, INITIAL_SERVICES, DEFAULT_SETTINGS } from './constants';
import { db } from './firebaseConfig';
import { ref, set, onValue } from "firebase/database";

const encodeSizeData = (data: Record<string, any>) => {
  const encoded: Record<string, any> = {};
  Object.entries(data || {}).forEach(([key, val]) => {
    const safeKey = key.replace(/\//g, '_SL_').replace(/\./g, '_DT_');
    encoded[safeKey] = val;
  });
  return encoded;
};

const decodeSizeData = (data: Record<string, any>) => {
  const decoded: Record<string, any> = {};
  Object.entries(data || {}).forEach(([key, val]) => {
    const originalKey = key.replace(/_SL_/g, '/').replace(/_DT_/g, '.');
    decoded[originalKey] = val;
  });
  return decoded;
};

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

  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }
    const dataRef = ref(db, 'businessData');
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.brands && Array.isArray(data.brands)) {
          const decodedBrands = data.brands.map((b: any) => ({
            ...b,
            availableSizes: Array.isArray(b.availableSizes) ? b.availableSizes : [],
            patterns: Array.isArray(b.patterns) ? b.patterns : [],
            sizeData: decodeSizeData(b.sizeData || {})
          }));
          _setBrands(decodedBrands);
        }
        if (data.services) _setServices(data.services);
        if (data.settings) _setSettings(data.settings);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const syncToCloud = async (customData?: any) => {
    if (!db) return;
    try {
      const isEvent = customData && (customData.nativeEvent || customData.target);
      const rawData = isEvent ? null : customData;
      const sourceBrands = rawData?.brands || brands;
      const sourceServices = rawData?.services || services;
      const sourceSettings = rawData?.settings || settings;
      const sanitizedBrands = sourceBrands.map((b: TyreBrand) => ({
        ...b,
        sizeData: encodeSizeData(b.sizeData || {})
      }));
      await set(ref(db, 'businessData'), {
        brands: sanitizedBrands,
        services: sourceServices,
        settings: sourceSettings,
        lastUpdated: new Date().toISOString()
      });
    } catch (e) {
      console.error("Firebase Sync Error:", e);
    }
  };

  const setBrands = (newBrands: TyreBrand[]) => {
    _setBrands(newBrands);
    if (isAdmin) syncToCloud({ brands: newBrands, services, settings });
  };

  const setServices = (newServices: ServiceItem[]) => {
    _setServices(newServices);
    if (isAdmin) syncToCloud({ brands, services: newServices, settings });
  };

  const setSettings = (newSettings: AppSettings) => {
    _setSettings(newSettings);
    if (isAdmin) syncToCloud({ brands, services, settings: newSettings });
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
