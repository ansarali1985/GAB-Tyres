import { ThemeType, TyreBrand, ServiceItem, AppSettings } from './types';

export const ALL_TYRE_SIZES = [
  "175/65 R14", "185/60 R15", "185/65 R15", "195/55 R15", "195/60 R15",
  "195/65 R15", "205/55 R16", "205/60 R16", "215/60 R16", "215/65 R16",
  "225/45 R17", "225/50 R17", "225/60 R17", "235/45 R17", "235/55 R17",
  "225/40 R18", "225/45 R18", "235/40 R18", "245/40 R18", "245/45 R18",
  "255/35 R19", "255/40 R19", "255/50 R19", "265/35 R19", "275/40 R20"
];

export const INITIAL_BRANDS: TyreBrand[] = [
  { 
    id: '1', 
    name: 'Michelin', 
    image: 'https://images.unsplash.com/photo-1578844541663-4711efaf3f1f?auto=format&fit=crop&q=80&w=400', 
    description: 'World-renowned for durability and high-end performance.', 
    patterns: [
      {
        id: 'p1',
        name: 'Pilot Sport 4',
        availableSizes: [ALL_TYRE_SIZES[6]],
        sizeData: {
          [ALL_TYRE_SIZES[6]]: { salePrice: 18500, purchasePrice: 15000, otherExpenses: 700 }
        }
      },
      {
        id: 'p2',
        name: 'Energy XM2+',
        availableSizes: [ALL_TYRE_SIZES[0]],
        sizeData: {
          [ALL_TYRE_SIZES[0]]: { salePrice: 12000, purchasePrice: 9500, otherExpenses: 500 }
        }
      }
    ]
  },
  { id: '2', name: 'Yokohama', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=400', description: 'Japanese precision engineered for maximum grip.', patterns: [] },
  { id: '3', name: 'Goodyear', image: 'https://images.unsplash.com/photo-1594731114940-0255a62f8373?auto=format&fit=crop&q=80&w=400', description: 'Innovative American designs for all-season confidence.', patterns: [] },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  { id: 's1', name: 'Tyre Repair', description: 'Expert puncture repair using industry-standard vulcanization.', price: 1500, icon: '🔧' },
  { id: 's2', name: 'Wheel Alignment', description: 'State-of-the-art 3D laser alignment for perfect handling.', price: 3500, icon: '📏', image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80&w=400' },
  { id: 's3', name: 'Wheel Balancing', description: 'Precision electronic balancing to eliminate vibrations.', price: 2000, icon: '⚖️' },
  { id: 's4', name: 'Nitrogen Filling', description: 'Keep your tyres cool and pressure consistent with Nitrogen.', price: 1000, icon: '💨' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  whatsappNumber: '923001234567',
  phoneNumber: '923001234567',
  businessEmail: 'info@gabtyres.com',
  theme: ThemeType.DEFAULT,
  adminUsername: 'Ansar',
  adminPassword: 'Anudada@007',
  businessName: 'GAB Tyres',
  businessAddress: 'Plot 42, Main Commercial Area, Phase 2, Industrial Estate',
  homeHeroImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
  homeHeroTitle: 'Performance Starts From The Ground Up.',
  homeHeroSubtitle: 'The most trusted tyre specialists in the region. Explore high-performance brands and precision services.',
  homeBrandsTitle: 'Featured Brands',
  homeServicesTitle: 'Expert Service Center',
  homeServicesSubtitle: 'Our workshop is equipped with the latest diagnostic tools to ensure your vehicle stays safe and balanced.',
  showHero: true,
  showBrands: true,
  showServices: true,
  showTrust: true,
  footerDescription: 'Premium tyre retailer providing the best brands and professional wheel services since 2010.',
  footerQuickLinks: [{ id: '1', label: 'About Us', url: '#' }],
  footerBusinessHours: [{ id: '1', day: 'Mon - Sat', hours: '9:00 - 20:00' }],
  footerSocials: [{ id: '1', platform: 'FB', url: '#' }]
};

export const THEMES = {
  [ThemeType.DEFAULT]: {
    primary: 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900',
    secondary: 'bg-blue-50',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-700',
    border: 'border-blue-500/30',
    accent: 'text-cyan-400',
    card: 'bg-white shadow-xl shadow-blue-900/10',
    nav: 'bg-slate-950/90 backdrop-blur-md'
  },
  [ThemeType.DARK]: {
    primary: 'bg-zinc-950',
    secondary: 'bg-zinc-900',
    text: 'text-white',
    hover: 'hover:bg-zinc-800',
    border: 'border-zinc-800',
    accent: 'text-lime-400',
    card: 'bg-zinc-900/50 backdrop-blur-md border border-zinc-800 shadow-2xl',
    nav: 'bg-black'
  },
  [ThemeType.LUXURY]: {
    primary: 'bg-gradient-to-tr from-stone-950 to-amber-950',
    secondary: 'bg-stone-50',
    text: 'text-amber-700',
    hover: 'hover:bg-amber-900',
    border: 'border-amber-900/20',
    accent: 'text-amber-200',
    card: 'bg-white shadow-2xl shadow-amber-950/20 border border-stone-100',
    nav: 'bg-stone-950/95'
  },
  [ThemeType.VIBRANT]: {
    primary: 'bg-gradient-to-r from-red-700 to-rose-600',
    secondary: 'bg-white',
    text: 'text-red-600',
    hover: 'hover:bg-red-800',
    border: 'border-red-600/20',
    accent: 'text-white',
    card: 'bg-white shadow-xl shadow-red-900/10 border border-red-50',
    nav: 'bg-red-700'
  },
  [ThemeType.NATURE]: {
    primary: 'bg-gradient-to-b from-emerald-900 to-teal-950',
    secondary: 'bg-emerald-50',
    text: 'text-emerald-700',
    hover: 'hover:bg-emerald-800',
    border: 'border-emerald-700/20',
    accent: 'text-emerald-200',
    card: 'bg-white shadow-lg border border-emerald-100',
    nav: 'bg-emerald-950'
  }
};
