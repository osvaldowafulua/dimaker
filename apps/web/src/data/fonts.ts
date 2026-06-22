export type FontCategory = 'sans serif' | 'serif' | 'script' | 'display' | 'basic';

export type FontRecord = {
  id: string;
  name: string;
  category: FontCategory;
  tags: string[];
  views: number;
  downloads: number;
  /** Google Fonts family query */
  googleFamily: string;
  googleWeights?: string;
};

/** Font catalog mirroring designali.in/fonts */
export const FONTS: FontRecord[] = [
  {
    id: 'the-visitor',
    name: 'The Visitor',
    category: 'sans serif',
    tags: ['Modern', 'Display'],
    views: 135,
    downloads: 23,
    googleFamily: 'Oswald',
    googleWeights: 'wght@400;600',
  },
  {
    id: 'aukera',
    name: 'Aukera',
    category: 'sans serif',
    tags: ['Modern', 'Display'],
    views: 61,
    downloads: 25,
    googleFamily: 'Space+Grotesk',
    googleWeights: 'wght@400;700',
  },
  {
    id: 'fragile',
    name: 'Fragile',
    category: 'serif',
    tags: ['Serif', 'Modern'],
    views: 169,
    downloads: 41,
    googleFamily: 'Playfair+Display',
    googleWeights: 'wght@400;700',
  },
  {
    id: 'daykids',
    name: 'Daykids',
    category: 'script',
    tags: ['Basic', 'Modern', 'Display'],
    views: 62,
    downloads: 22,
    googleFamily: 'Pacifico',
  },
  {
    id: 'sitewalk',
    name: 'Sitewalk',
    category: 'sans serif',
    tags: ['Modern', 'Display'],
    views: 55,
    downloads: 19,
    googleFamily: 'Inter',
    googleWeights: 'wght@400;600',
  },
  {
    id: 'gatheraz',
    name: 'Gatheraz',
    category: 'sans serif',
    tags: ['Serif', 'Modern', 'Display'],
    views: 88,
    downloads: 22,
    googleFamily: 'DM+Serif+Display',
  },
  {
    id: 'lepka',
    name: 'LEPKA',
    category: 'sans serif',
    tags: ['Serif', 'Modern'],
    views: 55,
    downloads: 8,
    googleFamily: 'Archivo+Black',
  },
  {
    id: 'marchevoked',
    name: 'MarchEvoked',
    category: 'sans serif',
    tags: ['Serif', 'Modern'],
    views: 22,
    downloads: 7,
    googleFamily: 'Cormorant',
    googleWeights: 'wght@400;700',
  },
  {
    id: 'felgine',
    name: 'Felgine',
    category: 'sans serif',
    tags: ['Serif', 'Modern'],
    views: 20,
    downloads: 4,
    googleFamily: 'Lora',
    googleWeights: 'wght@400;700',
  },
  {
    id: 'ut-exageld',
    name: 'UT Exageld',
    category: 'sans serif',
    tags: ['Modern', 'Display'],
    views: 24,
    downloads: 7,
    googleFamily: 'Anton',
  },
  {
    id: 'nova-klasse',
    name: 'Nova Klasse',
    category: 'sans serif',
    tags: ['Basic', 'Modern', 'Display'],
    views: 50,
    downloads: 8,
    googleFamily: 'Poppins',
    googleWeights: 'wght@400;600',
  },
  {
    id: 'daminga',
    name: 'Daminga',
    category: 'sans serif',
    tags: ['Basic', 'Modern', 'Display'],
    views: 38,
    downloads: 3,
    googleFamily: 'Montserrat',
    googleWeights: 'wght@400;700',
  },
];

export const FONT_TAG_FILTERS = [
  'All Categories',
  'Modern',
  'Display',
  'Serif',
  'Basic',
  'Script',
] as const;
