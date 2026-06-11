export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
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
      "Une flotte moderne et haut de gamme, renouvelée régulièrement pour vous garantir confort et sécurité tout au long de vos trajets.",
    icon: 'bus' as const,
    color: '#10B981',
  },
  {
    title: 'Réseau',
    description:
      "Une couverture nationale étendue desservant un large choix de destinations à travers tout le Royaume du Maroc.",
    icon: 'route' as const,
    color: '#EF4444',
  },
  {
    title: 'Tourisme',
    description:
      "Un service de location d'autocars premium, conçu sur-mesure pour vos voyages organisés et excursions de groupe.",
    icon: 'globe' as const,
    color: '#06B6D4',
  },
  {
    title: 'Messagerie',
    description:
      "Un service d'expédition rapide et sécurisé, soutenu par un vaste réseau d'agences de proximité partout au Maroc.",
    icon: 'package' as const,
    color: '#8B5CF6',
  },
] as const

export const COMPANY_INFO = {
  name: 'Pullman du Sud',
  fullName: 'PULLMAN DU SUD',
  description:
    "La compagnie Pullman du Sud est une société de transport spécialisée dans le transport interurbain de voyageurs, le transport touristique, le transport de marchandises et de messagerie express à travers le territoire marocain.",
  phone: '+212 5 22 30 30 30',
  address: '115 Av Brahim Roudani, Casablanca, Maroc',
  email: 'contact@pullmandusud.ma',
} as const
