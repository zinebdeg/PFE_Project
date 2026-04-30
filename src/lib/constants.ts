export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Voyageurs', href: '/voyageurs' },
  { label: 'Touristique', href: '/touristique' },
  { label: 'Messagerie', href: '/messagerie' },
  { label: 'Qui sommes-nous', href: '/about' },
] as const

export const POPULAR_CITIES = [
  'Rabat',
  'Casablanca',
  'Agadir',
  'Marrakech',
  'Tanger',
] as const

export const POPULAR_ROUTES = [
  { from: 'Casablanca', to: 'Fes' },
  { from: 'Rabat', to: 'Agadir' },
  { from: 'Casablanca', to: 'Agadir' },
  { from: 'Rabat', to: 'Oujda' },
  { from: 'Casablanca', to: 'Marrakech' },
  { from: 'Rabat', to: 'Fes' },
  { from: 'Casablanca', to: 'Tanger' },
  { from: 'Rabat', to: 'Marrakech' },
  { from: 'Casablanca', to: 'Meknes' },
  { from: 'Rabat', to: 'Tanger' },
  { from: 'Tanger', to: 'Casablanca' },
  { from: 'Agadir', to: 'Casablanca' },
  { from: 'Marrakech', to: 'Casablanca' },
  { from: 'Fes', to: 'Marrakech' },
  { from: 'Casablanca', to: 'Oujda' },
  { from: 'Oujda', to: 'Casablanca' },
  { from: 'Tanger', to: 'Marrakech' },
  { from: 'Marrakech', to: 'Tanger' },
] as const

export const STATS = [
  { label: 'Tickets réservés chaque jour', value: '+15K' },
  { label: 'Destinations et villes', value: '+80' },
  { label: 'Clients satisfaits', value: '+50K' },
] as const

export const SERVICES = [
  {
    title: 'Parc',
    description:
      "La poursuite d'investissement dans le renouvellement de la flotte du parc de transport haut de gamme",
    icon: 'bus' as const,
    color: '#10B981',
  },
  {
    title: 'Réseau',
    description:
      "Notre réseau de lignes de bus interurbaines couvre un large choix de destinations à l'intérieur du Royaume",
    icon: 'route' as const,
    color: '#EF4444',
  },
  {
    title: 'Tourisme',
    description:
      "Le transport touristique est un service qui a été spécialement conçu pour mettre à votre disposition nos autocars afin de répondre à vos besoins en location à travers le Maroc.",
    icon: 'globe' as const,
    color: '#06B6D4',
  },
  {
    title: 'Messagerie',
    description:
      "Nous mettons à votre disposition un réseau d'agences à travers le Maroc pour vos expéditions, quelque soit la nature de votre marchandise.",
    icon: 'package' as const,
    color: '#8B5CF6',
  },
] as const

export const COMPANY_INFO = {
  name: 'Trans GHAZALA',
  fullName: 'PULLMAN DU SUD',
  description:
    "Le groupement professionnel GHAZALA est une société de transport spécialisée dans le transport interurbain de voyageurs, le transport touristique, le transport de marchandises et de messagerie express à travers le territoire marocain.",
  phone: '05 3000 3000',
  address: '115 Av Brahim Roudani, Casablanca',
  email: 'info@ghazal.ma',
} as const
