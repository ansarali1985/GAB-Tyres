
export enum ThemeType {
  DEFAULT = 'DEFAULT',
  DARK = 'DARK',
  LUXURY = 'LUXURY',
  VIBRANT = 'VIBRANT',
  NATURE = 'NATURE'
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface BusinessHour {
  id: string;
  day: string;
  hours: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface SizeFinance {
  salePrice: number;
  purchasePrice: number;
  otherExpenses: number;
}

export interface TyreBrand {
  id: string;
  name: string;
  image: string;
  description: string;
  availableSizes: string[];
  sizeData: Record<string, SizeFinance>;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  image?: string; // Optional image to replace emoji
}

export interface AppSettings {
  whatsappNumber: string;
  phoneNumber: string;
  businessEmail: string;
  theme: ThemeType;
  adminUsername: string;
  adminPassword: string;
  businessName: string;
  businessAddress: string;
  // Dashboard Editable Content
  homeHeroImage: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeBrandsTitle: string;
  homeServicesTitle: string;
  homeServicesSubtitle: string;
  // Layout Management
  showHero: boolean;
  showBrands: boolean;
  showServices: boolean;
  showTrust: boolean;
  // Footer
  footerDescription: string;
  footerQuickLinks: FooterLink[];
  footerBusinessHours: BusinessHour[];
  footerSocials: SocialLink[];
}

export interface AppState {
  brands: TyreBrand[];
  services: ServiceItem[];
  settings: AppSettings;
}
