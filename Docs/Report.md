# Rapport Technique — Plateforme de Réservation de Bus "Trans GHAZALA"

## Table des Matières

1. [Vue d'Ensemble du Projet](#1-vue-densemble-du-projet)
2. [Stack Technique](#2-stack-technique)
3. [Architecture Globale](#3-architecture-globale)
4. [Structure du Projet](#4-structure-du-projet)
5. [Couche API (Backend)](#5-couche-api-backend)
6. [Couche RPC (Server Functions)](#6-couche-rpc-server-functions)
7. [Couche Hooks (État & Données)](#7-couche-hooks-état--données)
8. [Couche UI (Pages & Composants)](#8-couche-ui-pages--composants)
9. [Logique Métier (Business Logic)](#9-logique-métier-business-logic)
10. [Documentation API Markoub](#10-documentation-api-markoub)
11. [Flux de Données](#11-flux-de-données)
12. [Modèles de Données (TypeScript)](#12-modèles-de-données-typescript)

---

## 1. Vue d'Ensemble du Projet

Cette application est une **plateforme de réservation de billets de bus interurbains** pour le groupement **Trans GHAZALA / PULLMAN DU SUD**, un acteur majeur du transport au Maroc. Elle permet aux utilisateurs de :

- Rechercher des trajets entre villes marocaines
- Consulter les horaires, prix et disponibilités
- Sélectionner des sièges sur un plan de bus interactif
- Réserver et payer un billet en ligne
- Consulter, télécharger ou annuler une réservation existante

L'application s'appuie sur l'**API B2B Markoub** (`b2b-api.markoub.dev`) comme backend de données pour l'ensemble des opérations.

---

## 2. Stack Technique

| Couche | Technologie | Version | Rôle |
|---|---|---|---|
| **Runtime** | Node.js | — | Environnement d'exécution JavaScript |
| **Framework** | TanStack Start (React) | latest | Framework fullstack SSR/SSG avec server functions |
| **UI Library** | React | 19.2 | Bibliothèque de composants d'interface |
| **Routeur** | TanStack Router | latest | Routage typé avec file-based routing |
| **État serveur** | TanStack React Query | 5.95 | Cache, fetching et synchronisation de données |
| **Bundler** | Vite | 7.3 | Build tool ultra-rapide avec HMR |
| **CSS** | Tailwind CSS | 4.1 | Framework CSS utility-first |
| **Composants UI** | shadcn/ui + Radix UI | — | Composants accessibles et personnalisables |
| **Icônes** | Lucide React | 0.545 | Bibliothèque d'icônes SVG |
| **Validation** | Zod | 4.3 | Schémas de validation TypeScript |
| **Dates** | date-fns | 4.1 | Utilitaires de manipulation de dates |
| **Langage** | TypeScript | 5.7 | Typage statique |
| **Package Manager** | pnpm | — | Gestionnaire de paquets performant |
| **Tests** | Vitest + Testing Library | — | Tests unitaires et d'intégration |

### Diagramme du Stack

```mermaid
graph TB
    subgraph "Frontend (Client)"
        A["🖥️ React 19<br/>Composants UI"]
        B["🧭 TanStack Router<br/>Navigation typée"]
        C["📦 TanStack Query<br/>Cache & État"]
        D["🎨 Tailwind CSS 4<br/>Styling"]
    end

    subgraph "Fullstack Layer"
        E["⚡ TanStack Start<br/>Server Functions (RPC)"]
        F["🔧 Vite 7<br/>Build & Dev Server"]
    end

    subgraph "Backend (Externe)"
        G["🌐 API Markoub B2B<br/>REST API"]
    end

    A --> B
    A --> C
    A --> D
    C --> E
    E --> G
    F --> A
    F --> E
```

---

## 3. Architecture Globale

L'application suit une architecture **en couches** (layered architecture) avec une séparation stricte des responsabilités. Le pattern utilisé est souvent appelé **"Clean Frontend Architecture"**.

```mermaid
graph TD
    subgraph "🎨 Couche Présentation"
        P1["Pages (Routes)"]
        P2["Composants"]
        P3["Composants UI (shadcn)"]
    end

    subgraph "🔄 Couche État & Logique"
        H1["Hooks React"]
        H2["TanStack Query"]
    end

    subgraph "🔒 Couche RPC (Server Functions)"
        R1["Server Functions<br/>createServerFn()"]
    end

    subgraph "📡 Couche API"
        A1["Client API (fetch)"]
        A2["Types TypeScript"]
    end

    subgraph "🌐 Externe"
        E1["API Markoub B2B<br/>https://b2b-api.markoub.dev"]
    end

    P1 --> P2
    P2 --> P3
    P1 --> H1
    H1 --> H2
    H2 --> R1
    R1 --> A1
    A1 --> E1
    A2 -.-> A1
    A2 -.-> H1
    A2 -.-> P1
```

### Principes d'Architecture

1. **Séparation Client/Serveur** : Les appels API sont effectués côté serveur via les Server Functions de TanStack Start. Le token API n'est **jamais exposé au client**.
2. **File-Based Routing** : Les routes sont générées automatiquement à partir de la structure des fichiers dans `src/routes/`.
3. **Type Safety** : Toutes les couches partagent les mêmes types TypeScript définis dans `src/api/types.ts`.
4. **Server-Side Rendering (SSR)** : TanStack Start permet le rendu côté serveur pour optimiser le SEO et les performances initiales.

---

## 4. Structure du Projet

```
PFE_Project/
├── .env                          # Variables d'environnement (API URL, Token)
├── package.json                  # Dépendances et scripts
├── vite.config.ts                # Configuration Vite + plugins
├── tsconfig.json                 # Configuration TypeScript
│
├── public/                       # Fichiers statiques
├── Docs/                         # Documentation
│
└── src/
    ├── router.tsx                # Configuration du routeur TanStack
    ├── routeTree.gen.ts          # Arbre de routes auto-généré
    ├── styles.css                # Feuilles de style globales (Tailwind)
    │
    ├── api/                      # 📡 Couche API (serveur uniquement)
    │   ├── client.ts             # Client HTTP générique avec retry
    │   ├── types.ts              # Interfaces et types TypeScript
    │   ├── cities.api.ts         # Endpoints des villes
    │   ├── journeys.api.ts       # Endpoints des trajets
    │   ├── seat-map.api.ts       # Endpoint plan de sièges
    │   └── bookings.api.ts       # Endpoints des réservations
    │
    ├── rpc/                      # 🔒 Couche RPC (Server Functions)
    │   ├── cities.ts             # getCities
    │   ├── journeys-search.ts    # searchJourneys
    │   ├── journeys-stops.ts     # getJourneyStops
    │   ├── seat-map.ts           # getSeatMap
    │   ├── bookings-create.ts    # createBooking
    │   ├── bookings-pay.ts       # markBookingPaid
    │   ├── bookings-get.ts       # getBooking
    │   └── bookings-cancel.ts    # cancelBooking
    │
    ├── hooks/                    # 🔄 Hooks React (React Query wrappers)
    │   ├── use-cities.ts         # useCities()
    │   ├── use-journeys.ts       # useJourneySearch(), useSeatMap()
    │   ├── use-seat-map.ts       # useSeatMap() (alternative)
    │   └── use-booking.ts        # useCreateBooking(), useBooking(), etc.
    │
    ├── lib/                      # 🛠️ Utilitaires
    │   ├── utils.ts              # Fonction cn() (clsx + tailwind-merge)
    │   └── constants.ts          # Constantes (routes, villes, infos)
    │
    ├── routes/                   # 🧭 Pages (File-Based Routing)
    │   ├── __root.tsx            # Layout racine (Header/Footer/QueryProvider)
    │   ├── index.tsx             # Page d'accueil
    │   ├── about.tsx             # Page À propos
    │   ├── search.tsx            # Page de résultats de recherche
    │   ├── journey/
    │   │   └── $journeyId.tsx    # Détails d'un trajet
    │   └── booking/
    │       ├── checkout.$journeyId.tsx  # Page de réservation (checkout)
    │       └── $bookingCode.tsx         # Page de confirmation
    │
    └── components/               # 🎨 Composants React
        ├── Header.tsx            # En-tête du site
        ├── Footer.tsx            # Pied de page
        ├── ThemeToggle.tsx       # Bouton thème clair/sombre
        ├── home/                 # Composants page d'accueil
        │   ├── hero-section.tsx
        │   ├── stats-section.tsx
        │   ├── services-section.tsx
        │   └── popular-routes.tsx
        ├── search/               # Composants recherche
        │   └── search-form.tsx
        ├── journey/              # Composants trajets
        │   └── journey-card.tsx
        ├── booking/              # Composants réservation
        │   ├── seat-selection-card.tsx
        │   ├── seat-map-modal.tsx
        │   ├── passenger-form-section.tsx
        │   ├── passenger-form.tsx
        │   ├── payment-section.tsx
        │   └── booking-sidebar.tsx
        └── ui/                   # Composants UI réutilisables (shadcn)
            ├── button.tsx
            ├── calendar.tsx
            ├── input.tsx
            ├── label.tsx
            └── skeleton.tsx
```

---

## 5. Couche API (Backend)

### 5.1 Client HTTP (`api/client.ts`)

Le client API est un wrapper autour de `fetch()` qui s'exécute **exclusivement côté serveur**. Il fournit :

- **Authentification** : Token Bearer via env `MARKOUB_API_TOKEN`
- **Retry automatique** : 3 tentatives avec backoff exponentiel pour les erreurs 429 et 5xx
- **Gestion d'erreurs** : Classe `ApiError` personnalisée avec `statusCode` et `code`
- **Logging** : Chaque requête est loguée dans la console serveur

```mermaid
sequenceDiagram
    participant RPC as Server Function
    participant Client as apiRequest()
    participant API as API Markoub

    RPC->>Client: apiRequest('/journeys', { params })
    Client->>Client: Construire URL + Query Params
    Client->>Client: Ajouter Headers (Bearer Token)
    
    loop Jusqu'à 3 tentatives
        Client->>API: fetch(url, options)
        alt Réponse OK (2xx)
            API-->>Client: JSON Response
            Client-->>RPC: Données typées <T>
        else Erreur 429 / 5xx
            API-->>Client: Status Error
            Client->>Client: sleep(backoff)
            Note over Client: Retry avec délai exponentiel
        else Erreur Client (4xx)
            API-->>Client: Error Body
            Client-->>RPC: throw ApiError
        end
    end
```

### 5.2 Fichiers API

| Fichier | Fonctions | Endpoint API |
|---|---|---|
| `cities.api.ts` | `fetchCities(lang)` | `GET /cities` |
| `journeys.api.ts` | `fetchJourneys(params)` | `GET /journeys` |
| `journeys.api.ts` | `fetchJourneyStops(params)` | `GET /journeys/stops` |
| `seat-map.api.ts` | `fetchSeatMap(params)` | `GET /journeys/seat-map` |
| `bookings.api.ts` | `createBooking(data)` | `POST /bookings` |
| `bookings.api.ts` | `markBookingPaid(code, data)` | `POST /bookings/{code}/paid` |
| `bookings.api.ts` | `fetchBooking(code)` | `GET /bookings/{code}` |
| `bookings.api.ts` | `cancelBooking(code)` | `DELETE /bookings/{code}` |
| `bookings.api.ts` | `fetchBookingPdf(code)` | `GET /bookings/{code}/pdf` |

---

## 6. Couche RPC (Server Functions)

La couche RPC utilise les **Server Functions** de TanStack Start (`createServerFn()`). Ces fonctions s'exécutent côté serveur mais sont appelées depuis le client comme des fonctions normales. Cela garantit que :

- Le **token API** n'est jamais exposé au navigateur
- Les appels réseau vers l'API Markoub sont faits depuis le serveur Node.js
- Le client communique uniquement avec son propre serveur

```mermaid
graph LR
    subgraph "Navigateur (Client)"
        A["Hook React<br/>useQuery / useMutation"]
    end

    subgraph "Serveur Node.js"
        B["Server Function<br/>createServerFn()"]
        C["API Client<br/>apiRequest()"]
    end

    subgraph "API Externe"
        D["API Markoub<br/>b2b-api.markoub.dev"]
    end

    A -->|"RPC Call<br/>(sérialisé)"| B
    B --> C
    C -->|"HTTP + Bearer Token"| D
    D -->|"JSON Response"| C
    C -->|"Résultat"| B
    B -->|"Données<br/>(désérialisées)"| A
```

### Liste des Server Functions

| Fichier RPC | Fonction exportée | Méthode | Appelle |
|---|---|---|---|
| `cities.ts` | `getCities` | GET | `fetchCities()` |
| `journeys-search.ts` | `searchJourneys` | GET | `fetchJourneys()` |
| `journeys-stops.ts` | `getJourneyStops` | GET | `fetchJourneyStops()` |
| `seat-map.ts` | `getSeatMap` | GET | `fetchSeatMap()` |
| `bookings-create.ts` | `createBooking` | POST | `apiCreateBooking()` |
| `bookings-pay.ts` | `markBookingPaid` | POST | `apiMarkBookingPaid()` |
| `bookings-get.ts` | `getBooking` | GET | `fetchBooking()` |
| `bookings-cancel.ts` | `cancelBooking` | POST | `apiCancelBooking()` |

---

## 7. Couche Hooks (État & Données)

Les hooks React encapsulent la logique de fetching avec **TanStack React Query**. Ils fournissent :
- **Caching automatique** avec `staleTime` configuré
- **Refetch conditionnel** via le paramètre `enabled`
- **Mutations** avec gestion d'état (loading, error, success)

### Hooks de Lecture (useQuery)

| Hook | Fichier | Query Key | Données retournées |
|---|---|---|---|
| `useCities(lang)` | `use-cities.ts` | `['cities', lang]` | `City[]` |
| `useJourneySearch(params)` | `use-journeys.ts` | `['journeys', params]` | `JourneySearchResult` |
| `useJourneyStops(id, searchId)` | `use-journeys.ts` | `['journey-stops', id, searchId]` | `JourneyStop[]` |
| `useSeatMap(id, searchId)` | `use-journeys.ts` | `['seat-map', id, searchId]` | `SeatMapResponse[]` |
| `useBooking(code)` | `use-booking.ts` | `['booking', code]` | `Booking` |

### Hooks de Mutation (useMutation)

| Hook | Fichier | Action |
|---|---|---|
| `useCreateBooking()` | `use-booking.ts` | Crée une nouvelle réservation |
| `useMarkBookingPaid()` | `use-booking.ts` | Marque une réservation comme payée |
| `useCancelBooking()` | `use-booking.ts` | Annule une réservation |

---

## 8. Couche UI (Pages & Composants)

### 8.1 Carte de Navigation (Sitemap)

```mermaid
graph TD
    ROOT["__root.tsx<br/>Layout: Header + Footer + QueryProvider"]
    
    ROOT --> HOME["/ (index.tsx)<br/>🏠 Page d'accueil"]
    ROOT --> SEARCH["/ search?params<br/>🔍 Résultats de recherche"]
    ROOT --> ABOUT["/about<br/>ℹ️ À propos"]
    ROOT --> JOURNEY["/journey/$journeyId<br/>🚌 Détails d'un trajet"]
    ROOT --> CHECKOUT["/booking/checkout/$journeyId<br/>🛒 Page de réservation"]
    ROOT --> CONFIRM["/booking/$bookingCode<br/>✅ Confirmation"]

    HOME -->|"Rechercher"| SEARCH
    SEARCH -->|"Sélectionner un trajet"| CHECKOUT
    CHECKOUT -->|"Payer"| CONFIRM
```

### 8.2 Pages

| Route | Fichier | Description |
|---|---|---|
| `/` | `index.tsx` | Page d'accueil avec Hero, Stats, Services, Routes populaires |
| `/search` | `search.tsx` | Résultats de recherche avec filtres et liste de journey cards |
| `/about` | `about.tsx` | Page de présentation de l'entreprise |
| `/journey/$journeyId` | `journey/$journeyId.tsx` | Détails détaillés d'un trajet spécifique |
| `/booking/checkout/$journeyId` | `booking/checkout.$journeyId.tsx` | Page checkout : sièges + formulaire passager + paiement |
| `/booking/$bookingCode` | `booking/$bookingCode.tsx` | Confirmation de réservation avec billet |

### 8.3 Composants

#### Composants Globaux
- `Header.tsx` — Barre de navigation principale
- `Footer.tsx` — Pied de page avec informations de l'entreprise
- `ThemeToggle.tsx` — Basculement thème clair/sombre

#### Composants Page d'Accueil (`home/`)
- `hero-section.tsx` — Bannière principale avec formulaire de recherche
- `stats-section.tsx` — Statistiques clés (+15K tickets/jour, +80 destinations)
- `services-section.tsx` — Présentation des services (Parc, Réseau, Tourisme, Messagerie)
- `popular-routes.tsx` — Grille des itinéraires populaires

#### Composants Recherche (`search/`)
- `search-form.tsx` — Formulaire complet : ville départ, ville arrivée, date, nombre de passagers

#### Composants Trajet (`journey/`)
- `journey-card.tsx` — Carte de résultat avec prix, horaires et bouton de réservation

#### Composants Réservation (`booking/`)
- `seat-selection-card.tsx` — Carte résumant les sièges sélectionnés
- `seat-map-modal.tsx` — Modal plein écran avec plan interactif du bus
- `passenger-form-section.tsx` — Formulaire des informations passager (nom, email, téléphone)
- `payment-section.tsx` — Sélection du mode de paiement (carte ou espèces)
- `booking-sidebar.tsx` — Résumé du trajet et prix avec bouton "Passer au paiement"

#### Composants UI (`ui/`) — shadcn/ui
- `button.tsx`, `calendar.tsx`, `input.tsx`, `label.tsx`, `skeleton.tsx`

---

## 9. Logique Métier (Business Logic)

### 9.1 Flux de Réservation Complet

```mermaid
sequenceDiagram
    actor User as Utilisateur
    participant Home as Page d'Accueil
    participant Search as Page Recherche
    participant Checkout as Page Checkout
    participant API as API Markoub
    participant Confirm as Page Confirmation

    User->>Home: Saisit Départ, Arrivée, Date, Passagers
    Home->>Search: Navigation → /search?params

    Search->>API: GET /journeys (via RPC)
    API-->>Search: Liste des trajets disponibles
    Search->>User: Affiche les Journey Cards

    User->>Search: Clique "Réserver" sur un trajet
    Search->>Checkout: Navigation → /booking/checkout/$journeyId
    
    Note over Checkout: Vérification showSeatMap

    alt showSeatMap === true
        Checkout->>API: GET /journeys/seat-map (via RPC)
        API-->>Checkout: Plan de sièges
        Checkout->>User: Modal de sélection de sièges
        User->>Checkout: Sélectionne N sièges (= nb passagers)
    else showSeatMap === false
        Note over Checkout: Pas de sélection de siège requise
    end

    User->>Checkout: Remplit formulaire passager
    User->>Checkout: Choisit mode de paiement
    User->>Checkout: Clique "Passer au paiement"
    
    Note over Checkout: Validation des données

    Checkout->>API: POST /bookings (Étape 1 : Créer)
    API-->>Checkout: Booking { code, paymentToken, totalPrice }
    
    Checkout->>API: POST /bookings/{code}/paid (Étape 2 : Payer)
    API-->>Checkout: { success: true }

    Checkout->>Confirm: Navigation → /booking/$bookingCode
    Confirm->>API: GET /bookings/{code}
    API-->>Confirm: Détails complets de la réservation
    Confirm->>User: Affiche le billet avec toutes les infos
```

### 9.2 Règles de Validation

#### Validation des Sièges (Conditionnelle)

```
SI journey.showSeatMap === true ALORS
  ├── Le passager DOIT sélectionner des sièges
  ├── Le nombre de sièges sélectionnés DOIT = nbrOfPassengers
  └── Blocage de la réservation si non respecté

SINON (showSeatMap === false / null / undefined)
  ├── Pas de sélection de siège requise
  ├── La section "Sélection de siège" affiche un message informatif
  └── Le processus de paiement est directement accessible
```

#### Validation du Formulaire Passager

```
REQUIS :
  ├── name   → Ne doit pas être vide
  ├── email  → Ne doit pas être vide
  └── phone  → Ne doit pas être vide
```

### 9.3 Processus de Paiement Séquentiel

Le paiement se fait en **2 étapes distinctes** gérées séquentiellement dans `handleProcessBooking()` :

```mermaid
stateDiagram-v2
    [*] --> Validation
    Validation --> Creating: Données valides
    Validation --> [*]: Données invalides (alert)
    
    Creating --> Paying: Booking créé (code + token reçus)
    Creating --> Error: Erreur API
    
    Paying --> Redirect: Paiement confirmé
    Paying --> Error: Erreur paiement
    
    Redirect --> Confirmation: /booking/{code}
    Error --> [*]: Alert utilisateur

    state Creating {
        [*] --> APICall: POST /bookings
        APICall --> BookingCreated: code + paymentToken
    }

    state Paying {
        [*] --> PaymentCall: POST /bookings/{code}/paid
        PaymentCall --> PaymentDone: success
    }
```

### 9.4 Gestion du Thème (Clair/Sombre)

Le thème est géré via un script d'initialisation injecté dans le `<head>` pour éviter le flash de thème (FOUC). Il prend en charge 3 modes : `light`, `dark`, et `auto` (suit les préférences système).

---

## 10. Documentation API Markoub

### Base URL
```
https://b2b-api.markoub.dev
```

### Authentification
```
Authorization: Bearer {MARKOUB_API_TOKEN}
Content-Type: application/json
```

### Endpoints

#### 🏙️ Villes

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/cities?lang={fr}` | Liste de toutes les villes desservies |

**Réponse** : `City[]`
```typescript
{ id: number, name: string, latitude: string, longitude: string }
```

---

#### 🚌 Trajets

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/journeys` | Rechercher des trajets disponibles |
| `GET` | `/journeys/stops` | Obtenir les arrêts intermédiaires |
| `GET` | `/journeys/seat-map` | Obtenir le plan de sièges |

**GET /journeys — Paramètres :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `departureCityId` | number | ✅ | ID de la ville de départ |
| `arrivalCityId` | number | ✅ | ID de la ville d'arrivée |
| `date` | string | ✅ | Date au format `YYYY-MM-DD` |
| `nbrOfPassengers` | number | ✅ | Nombre de passagers |
| `searchId` | string | ❌ | ID de recherche pour réutilisation |

**Réponse** : `JourneySearchResult`
```typescript
{
  searchId: string,          // Identifiant unique de cette session de recherche
  expiresAt: string,         // Date d'expiration de la session
  expiresInMinutes: number,  // Minutes avant expiration
  journeys: Journey[]        // Liste des trajets disponibles
}
```

**GET /journeys/stops — Paramètres :**

| Paramètre | Type | Requis |
|---|---|---|
| `journeyId` | number | ✅ |
| `searchId` | string | ✅ |

**GET /journeys/seat-map — Paramètres :**

| Paramètre | Type | Requis |
|---|---|---|
| `journeyId` | number | ✅ |
| `searchId` | string | ✅ |

**Réponse** : `SeatMapResponse[]`
```typescript
{
  selectedSeats: { seatNumber: number, index: string }[],
  seatMap: Seat[][]  // Grille 2D du bus
}
// Chaque Seat :
{ type: 'available' | 'reserved' | 'empty' | 'closed', index: string, seatNumber: number }
```

---

#### 🎫 Réservations

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/bookings` | Créer une nouvelle réservation |
| `POST` | `/bookings/{code}/paid` | Marquer comme payée |
| `GET` | `/bookings/{code}` | Obtenir les détails d'une réservation |
| `DELETE` | `/bookings/{code}` | Annuler une réservation |
| `GET` | `/bookings/{code}/pdf` | Télécharger le billet PDF |

**POST /bookings — Body :**
```typescript
{
  journeyId: string,
  searchId: string,
  name: string,
  phone: string,
  email: string,
  seats: number[]    // [] si showSeatMap est false
}
```

**Réponse** : `Booking`
```typescript
{
  id: number,
  code: string,              // Code unique de réservation
  paymentToken: string,      // Token pour le processus de paiement
  totalPrice: number,
  status: string,            // 'pending' | 'paid' | 'confirmed' | 'cancelled'
  routes: BookingRoute[],
  tickets: Ticket[],
  // ... autres champs
}
```

**POST /bookings/{code}/paid — Body :**
```typescript
{
  paidPrice: string,
  referenceNumber: string,
  additionalInfo?: string
}
```

---

## 11. Flux de Données

### Vue d'ensemble du flux de données dans l'application

```mermaid
flowchart TD
    subgraph "🖥️ CLIENT (Navigateur)"
        UI["Composants React"] --> |"Appelle"| HOOKS["Hooks (useQuery / useMutation)"]
        HOOKS --> |"Met à jour"| CACHE["Cache React Query"]
        CACHE --> |"Re-render"| UI
    end

    subgraph "⚡ SERVEUR (Node.js)"
        RPC["Server Functions (RPC)"] --> |"Appelle"| APILAYER["Fonctions API (fetch)"]
        APILAYER --> |"HTTP Request"| EXTERNAL["API Markoub B2B"]
        EXTERNAL --> |"JSON Response"| APILAYER
        APILAYER --> |"Données typées"| RPC
    end

    HOOKS --> |"RPC Call (sérialisé)"| RPC
    RPC --> |"Résultat (désérialisé)"| HOOKS

    ENV[".env<br/>MARKOUB_API_URL<br/>MARKOUB_API_TOKEN"] -.-> APILAYER
```

### Cycle de vie d'une requête

1. **Composant** → Le composant React appelle un hook (ex: `useJourneySearch()`)
2. **Hook** → Le hook utilise `useQuery()` avec une `queryFn` qui appelle une Server Function
3. **Server Function** → La server function s'exécute côté serveur, extrait les paramètres, et appelle la fonction API
4. **API Client** → `apiRequest()` construit la requête HTTP avec le token d'authentification
5. **API Externe** → La requête est envoyée à `b2b-api.markoub.dev`
6. **Retour** → La réponse remonte à travers toutes les couches jusqu'au composant
7. **Cache** → React Query met en cache le résultat et gère le rafraîchissement

---

## 12. Modèles de Données (TypeScript)

### Diagramme des Relations entre Types

```mermaid
erDiagram
    JourneySearchResult {
        string searchId
        string expiresAt
        number expiresInMinutes
    }

    Journey {
        number id
        string name
        string inventory
        boolean showSeatMap
        string duration
        number seatsLeft
        string departureDate
        string arrivalDate
    }

    Bus {
        number id
        string name
        string image
    }

    Company {
        number id
        string name
        string logo
    }

    Station {
        number id
        string time
        number cityId
        string cityName
        string stationName
    }

    Price {
        number single
        number total
        number serviceFees
    }

    SeatMapResponse {
        array selectedSeats
    }

    Seat {
        string type
        string index
        number seatNumber
    }

    Booking {
        number id
        string code
        string paymentToken
        string status
        number totalPrice
        string email
        string name
        string phone
    }

    BookingRoute {
        number id
        string departureCityName
        string arrivalCityName
        string departureTime
        string arrivalTime
        string date
    }

    Ticket {
        number id
        string code
        number seat
        number price
        string status
    }

    City {
        number id
        string name
        string latitude
        string longitude
    }

    JourneySearchResult ||--|{ Journey : "contient"
    Journey ||--|| Bus : "utilise"
    Journey ||--|| Company : "opéré par"
    Journey ||--|| Station : "départ (from)"
    Journey ||--|| Station : "arrivée (to)"
    Journey ||--|| Price : "a un"
    Journey ||--o| SeatMapResponse : "peut avoir"
    SeatMapResponse ||--|{ Seat : "contient (grille 2D)"
    Booking ||--|{ BookingRoute : "contient"
    Booking ||--|{ Ticket : "contient"
```

---

> **Note** : Ce rapport reflète l'état actuel de l'application. L'architecture est conçue pour être maintenable et extensible, avec une séparation claire entre les couches de présentation, logique métier, et accès aux données.
