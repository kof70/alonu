export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export interface Artisan {
  id: string;
  originalIdArtisan?: number; // ID original de l'API pour les liens
  name: string;
  profession: string;
  category: string;
  distance: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  avatar?: string;
  coverImage?: string;
  description: string;
  services: string[];
  phone: string;
  whatsapp: string;
  address: string;
  latitude: number;
  longitude: number;
  gallery: string[];
  schedule: {
    [key: string]: string;
  };
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Textile, habillement, cuirs et peaux",
    icon: "Shirt",
    subcategories: [
      "Couturiers",
      "Tailleurs",
      "Brodeurs",
      "Maroquiniers",
      "Cordonniers",
    ],
  },
  {
    id: "2",
    name: "Bois et ameublement",
    icon: "Armchair",
    subcategories: [
      "Menuisiers",
      "Ébénistes",
      "Charpentiers",
      "Sculpteurs sur bois",
    ],
  },
  {
    id: "3",
    name: "Métaux",
    icon: "Hammer",
    subcategories: [
      "Forgerons",
      "Soudeurs",
      "Ferblantiers",
      "Bijoutiers",
    ],
  },
  {
    id: "4",
    name: "Bâtiment et construction",
    icon: "Building2",
    subcategories: [
      "Maçons",
      "Plombiers",
      "Électriciens",
      "Peintres",
    ],
  },
  {
    id: "5",
    name: "Arts et décoration",
    icon: "Palette",
    subcategories: [
      "Calligraphes",
      "Céramistes",
      "Peintres décorateurs",
      "Sculpteurs",
    ],
  },
  {
    id: "6",
    name: "Alimentation",
    icon: "UtensilsCrossed",
    subcategories: [
      "Boulangers",
      "Pâtissiers",
      "Bouchers",
      "Fromagers",
    ],
  },
];

export const artisans: Artisan[] = [
  {
    id: "1",
    name: "AGBO Marc",
    profession: "Calligraphe",
    category: "Arts et décoration",
    distance: 4.16,
    rating: 4.8,
    reviewCount: 24,
    verified: true,
    description: "Artisan calligraphe spécialisé dans les écritures traditionnelles et modernes. Plus de 15 ans d'expérience.",
    services: [
      "Calligraphie pour événements",
      "Enseignes personnalisées",
      "Cartes de visite",
      "Décorations murales",
    ],
    phone: "+229 97 12 34 56",
    whatsapp: "+229 97 12 34 56",
    address: "Quartier Akpakpa, Cotonou",
    latitude: 6.3654,
    longitude: 2.4183,
    gallery: [],
    schedule: {
      "Lundi": "08:00 - 18:00",
      "Mardi": "08:00 - 18:00",
      "Mercredi": "08:00 - 18:00",
      "Jeudi": "08:00 - 18:00",
      "Vendredi": "08:00 - 18:00",
      "Samedi": "09:00 - 14:00",
      "Dimanche": "Fermé",
    },
    reviews: [
      {
        id: "1",
        author: "Sophie D.",
        rating: 5,
        comment: "Travail exceptionnel ! Marc a réalisé toute la calligraphie de notre mariage. Très professionnel.",
        date: "2024-09-15",
      },
      {
        id: "2",
        author: "Jean K.",
        rating: 4,
        comment: "Bon travail, délais respectés. Je recommande.",
        date: "2024-08-22",
      },
    ],
  },
  {
    id: "2",
    name: "KOFFI Estelle",
    profession: "Couturière",
    category: "Textile, habillement, cuirs et peaux",
    distance: 2.3,
    rating: 4.9,
    reviewCount: 56,
    verified: true,
    description: "Spécialiste de la couture sur mesure et retouches. Création de tenues traditionnelles et modernes.",
    services: [
      "Couture sur mesure",
      "Retouches",
      "Tenues traditionnelles",
      "Robes de cérémonie",
    ],
    phone: "+229 96 78 90 12",
    whatsapp: "+229 96 78 90 12",
    address: "Quartier Godomey, Abomey-Calavi",
    latitude: 6.4489,
    longitude: 2.3564,
    gallery: [],
    schedule: {
      "Lundi": "09:00 - 19:00",
      "Mardi": "09:00 - 19:00",
      "Mercredi": "09:00 - 19:00",
      "Jeudi": "09:00 - 19:00",
      "Vendredi": "09:00 - 19:00",
      "Samedi": "10:00 - 16:00",
      "Dimanche": "Fermé",
    },
    reviews: [
      {
        id: "1",
        author: "Marie T.",
        rating: 5,
        comment: "Estelle est une artiste ! Ma robe était parfaite.",
        date: "2024-10-01",
      },
    ],
  },
  {
    id: "3",
    name: "DOSSOU Pierre",
    profession: "Menuisier",
    category: "Bois et ameublement",
    distance: 5.8,
    rating: 4.7,
    reviewCount: 38,
    verified: true,
    description: "Menuisier ébéniste créant des meubles sur mesure de qualité. Restauration d'anciens meubles.",
    services: [
      "Meubles sur mesure",
      "Restauration",
      "Portes et fenêtres",
      "Aménagement intérieur",
    ],
    phone: "+229 94 56 78 90",
    whatsapp: "+229 94 56 78 90",
    address: "Quartier Fidjrossè, Cotonou",
    latitude: 6.3702,
    longitude: 2.3912,
    gallery: [],
    schedule: {
      "Lundi": "07:00 - 17:00",
      "Mardi": "07:00 - 17:00",
      "Mercredi": "07:00 - 17:00",
      "Jeudi": "07:00 - 17:00",
      "Vendredi": "07:00 - 17:00",
      "Samedi": "08:00 - 13:00",
      "Dimanche": "Fermé",
    },
    reviews: [],
  },
  {
    id: "4",
    name: "SANTOS Rita",
    profession: "Bijoutière",
    category: "Métaux",
    distance: 1.2,
    rating: 5.0,
    reviewCount: 42,
    verified: false,
    description: "Création de bijoux artisanaux uniques. Spécialité : bijoux en argent et bronze.",
    services: [
      "Bijoux sur mesure",
      "Réparation de bijoux",
      "Gravure",
      "Bijoux traditionnels",
    ],
    phone: "+229 97 11 22 33",
    whatsapp: "+229 97 11 22 33",
    address: "Quartier Cadjèhoun, Cotonou",
    latitude: 6.3833,
    longitude: 2.3833,
    gallery: [],
    schedule: {
      "Lundi": "10:00 - 18:00",
      "Mardi": "10:00 - 18:00",
      "Mercredi": "10:00 - 18:00",
      "Jeudi": "10:00 - 18:00",
      "Vendredi": "10:00 - 18:00",
      "Samedi": "10:00 - 15:00",
      "Dimanche": "Fermé",
    },
    reviews: [],
  },
  {
    id: "5",
    name: "MAMADOU Ali",
    profession: "Plombier",
    category: "Bâtiment et construction",
    distance: 3.5,
    rating: 4.6,
    reviewCount: 31,
    verified: true,
    description: "Expert en plomberie et installation sanitaire. Interventions rapides pour dépannages.",
    services: [
      "Installation sanitaire",
      "Dépannage",
      "Rénovation salle de bain",
      "Détection de fuites",
    ],
    phone: "+229 95 44 55 66",
    whatsapp: "+229 95 44 55 66",
    address: "Quartier Zogbo, Cotonou",
    latitude: 6.3528,
    longitude: 2.4297,
    gallery: [],
    schedule: {
      "Lundi": "07:30 - 18:00",
      "Mardi": "07:30 - 18:00",
      "Mercredi": "07:30 - 18:00",
      "Jeudi": "07:30 - 18:00",
      "Vendredi": "07:30 - 18:00",
      "Samedi": "08:00 - 14:00",
      "Dimanche": "Urgences uniquement",
    },
    reviews: [],
  },
  {
    id: "6",
    name: "TOSSOU Judith",
    profession: "Pâtissière",
    category: "Alimentation",
    distance: 2.7,
    rating: 4.9,
    reviewCount: 67,
    verified: true,
    description: "Pâtisserie artisanale, gâteaux personnalisés pour tous événements.",
    services: [
      "Gâteaux de mariage",
      "Pâtisseries fines",
      "Gâteaux d'anniversaire",
      "Viennoiseries",
    ],
    phone: "+229 96 33 44 55",
    whatsapp: "+229 96 33 44 55",
    address: "Quartier Vossa, Cotonou",
    latitude: 6.3589,
    longitude: 2.4142,
    gallery: [],
    schedule: {
      "Lundi": "06:00 - 19:00",
      "Mardi": "06:00 - 19:00",
      "Mercredi": "06:00 - 19:00",
      "Jeudi": "06:00 - 19:00",
      "Vendredi": "06:00 - 19:00",
      "Samedi": "06:00 - 20:00",
      "Dimanche": "07:00 - 14:00",
    },
    reviews: [],
  },
];
