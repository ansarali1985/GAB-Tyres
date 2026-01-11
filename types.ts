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
  patterns: string[]; // New field for patterns (models)
  sizeData: Record<string, SizeFinance>;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  image?: string;
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
  homeHeroImage: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeBrandsTitle: string;
  homeServicesTitle: string;
  homeServicesSubtitle: string;
  showHero: boolean;
  showBrands: boolean;
  showServices: boolean;
  showTrust: boolean;
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
