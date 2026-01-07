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

/* ------------------------
   Helper mappers (deep)
   ------------------------ */

const isPlainObject = (v: any) =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const toSnake = (input: any): any => {
  if (Array.isArray(input)) return input.map(toSnake);
  if (!isPlainObject(input)) return input;

  const out: Record<string, any> = {};
  for (const key of Object.keys(input)) {
    const val = (input as any)[key];

    // map camelCase -> snake_case, with explicit overrides for DB column names
    const newKey = ((): string => {
      // explicit exceptions: map these camelCase keys to DB's exact names
      if (key === 'availableSizes') return 'availablesizes';
      if (key === 'sizeData') return 'sizedata';
      // default conversion for all others
      return key.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
    })();

    if (Array.isArray(val)) {
      out[newKey] = val.map((v) => (isPlainObject(v) || Array.isArray(v) ? toSnake(v) : v));
    } else if (isPlainObject(val)) {
      out[newKey] = toSnake(val);
    } else {
      out[newKey] = val;
    }
  }
  return out;
};
/**
 * toCamel - deep convert object keys from snake_case to camelCase
 */
const toCamel = (input: any): any => {
  if (Array.isArray(input)) return input.map(toCamel);
  if (!isPlainObject(input)) return input;
  const out: Record<string, any> = {};
  for (const key of Object.keys(input)) {
    const val = (input as any)[key];
    const newKey = toCamel(key);
    if (Array.isArray(val)) {
      out[newKey] = val.map((v) => (isPlainObject(v) || Array.isArray(v) ? toCamel(v) : v));
    } else if (isPlainObject(val)) {
      out[newKey] = toCamel(val);
    } else {
      out[newKey] = val;
    }
  }
  return out;
};

/* ------------------------
   AppProvider
   ------------------------ */

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
          // Fetch from Supabase (use exact DB column names)
          const [brandsRes, servicesRes, settingsRes] = await Promise.all([
            supabase.from('brands').select('id, name, image, description, availablesizes, sizedata'),
            supabase.from('services').select('id, name, description, price, icon, image'),
            supabase.from('settings').select('id, whatsappnumber, phonenumber, businessemail, theme, adminusername, adminpassword, businessname, businessaddress, homeheroimage, homeherotitle, homeherosubtitle, homebrandstitle, homeservicestitle, homeservicessubtitle, showhero, showbrands, showservices, showtrust, footerdescription, footerquicklinks, footerbusinesshours, footersocials').maybeSingle()
          ]);

          if (brandsRes.error) console.error("Cloud Brands Error:", brandsRes.error.message);
          if (servicesRes.error) console.error("Cloud Services Error:", servicesRes.error.message);
          if (settingsRes.error) console.error("Cloud Settings Error:", settingsRes.error.message);

          // Only use cloud data if it actually exists in the database
          let cloudDataFound = false;

          if (brandsRes.data && brandsRes.data.length > 0) {
            // Convert incoming snake_case -> camelCase
            setBrands((brandsRes.data as any[]).map(toCamel));
            cloudDataFound = true;
          }
          if (servicesRes.data && servicesRes.data.length > 0) {
            setServices((servicesRes.data as any[]).map(toCamel));
            cloudDataFound = true;
          }
          if (settingsRes.data) {
            setSettings(toCamel(settingsRes.data));
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
      alert("Cloud database not connected. Check environment variables.");
      return;
    }

    try {
      console.log("Starting Global Sync...");
      
      // 1. Sync Brands
      // Convert outgoing payloads to snake_case
      const brandsSnake = brands.map(toSnake);
      const { error: bDelErr } = await supabase.from('brands').delete().neq('id', '0');
      if (bDelErr) throw new Error("Brands Delete Failed: " + bDelErr.message);
      const { error: bInsErr } = await supabase.from('brands').insert(brandsSnake);
      if (bInsErr) throw new Error("Brands Insert Failed: " + bInsErr.message);

      // 2. Sync Services
      const servicesSnake = services.map(toSnake);
      const { error: sDelErr } = await supabase.from('services').delete().neq('id', '0');
      if (sDelErr) throw new Error("Services Delete Failed: " + sDelErr.message);
      const { error: sInsErr } = await supabase.from('services').insert(servicesSnake);
      if (sInsErr) throw new Error("Services Insert Failed: " + sInsErr.message);

      // 3. Sync Settings
      const settingsSnake = toSnake({ id: 1, ...settings });
      const { error: setErr } = await supabase.from('settings').upsert(settingsSnake);
      if (setErr) throw new Error("Settings Sync Failed: " + setErr.message);
      
      alert("GLOBAL UPDATE LIVE! Every device worldwide now sees your latest changes.");
    } catch (e: any) {
      console.error("Sync Error:", e);
      alert("Update Failed: " + e.message + "\n\nMake sure you disabled RLS in Supabase SQL Editor or configured appropriate policies.");
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
