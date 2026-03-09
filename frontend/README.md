# SheryCinema — Frontend

A modern, cinematic movie & TV show discovery platform built with **React 19**, **Redux Toolkit**, and the **TMDB API**. Explore trending content, search in real time, watch trailers, manage favorites, and track your watch history — all wrapped in a sleek dark-themed UI with smooth animations.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?logo=redux&logoColor=white)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Routing](#routing)
- [Architecture](#architecture)
- [Admin Panel](#admin-panel)
- [License](#license)

---

## Features

### Content Discovery

- **Trending Feed** — Infinite-scroll grid of trending movies & TV shows with staggered entrance animations
- **Explore Page** — Debounced (700ms) multi-search with media-type tabs (All / Movie / TV), genre filters, and sort options
- **Movies Hub** — Hero banner (random top-5 pick), carousels for Trending, Top Rated, Upcoming, and genre-specific content
- **TV Shows Hub** — Same layout as Movies with TV-specific endpoints (Popular, On the Air, etc.)
- **Category View** — Dedicated infinite-scroll pages linked from carousel "View All" buttons
- **Media Details** — Full media info with backdrop hero, genres, rating, runtime/seasons, budget/networks, cast list, trailer playback, and similar recommendations

### User Features

- **Favorites** — Add/remove via heart icon on any card; optimistic UI with rollback on error; filter by type on a dedicated page
- **Watch History** — Auto-recorded when a trailer is played; sorted newest-first with type filters
- **Authentication** — Signup → email verification → login flow with JWT; token auto-attached via Axios interceptor

### Admin Panel (role-gated)

- **Movies Management** — CRUD operations with TMDB ID, poster upload, and genre tagging
- **Users Management** — Promote/demote roles, ban/unban, verify/unverify, and delete users

### UI / UX

- Dark cinematic aesthetic with glass-panel auth layout and gradient overlays
- Responsive design — mobile-first grids (`2 → 3 → 4 → 5` columns)
- Framer Motion animations — staggered grids, spring physics, carousel slides, mobile menu transitions
- Fixed sidebar (desktop) with active-tab indicator + mobile overlay menu
- Navbar with scroll-aware blur, inline search bar (desktop), and toggle search (mobile)

---

## Tech Stack

| Category          | Technology                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| **Framework**     | React 19, Vite 7                                                       |
| **State**         | Redux Toolkit (auth), React Context (favorites)                        |
| **Routing**       | React Router DOM 7                                                     |
| **Styling**       | Tailwind CSS 3.4, Sass, Framer Motion                                  |
| **HTTP**          | Axios (JWT interceptor, `withCredentials`)                             |
| **UI Components** | Headless UI, Radix UI (Slot), Lucide React icons, CVA + clsx + twMerge |
| **Data Source**   | TMDB API v3                                                            |
| **Linting**       | ESLint 9 with React Hooks & React Refresh plugins                      |

---

## Project Structure

```
src/
├── assets/                    # Static assets
├── components/
│   ├── layouts/
│   │   ├── AuthLayout.jsx     # Glass-panel auth wrapper
│   │   └── MainLayout.jsx     # Sidebar + Navbar + content area
│   ├── shared/
│   │   ├── AdminRoute.jsx     # Role-based route guard
│   │   ├── Navbar.jsx         # Top bar with search & mobile menu
│   │   ├── ProtectedRoute.jsx # Auth guard (redirects to /login)
│   │   ├── ScrollToTop.jsx    # Auto-scroll on route change
│   │   └── Sidebar.jsx        # Fixed navigation sidebar
│   └── ui/
│       ├── HeroBanner.jsx     # Random hero with backdrop & CTAs
│       ├── MediaCarousel.jsx  # Horizontal snap-scroll carousel
│       ├── MovieCard.jsx      # Poster card with hover overlay & fav toggle
│       └── SkeletonCard.jsx   # Animated loading placeholder
├── hooks/
│   ├── useDebounce.js         # 700ms debounce hook
│   └── useFavorites.js        # Favorites context consumer
├── lib/
│   └── utils.js               # cn() — clsx + tailwind-merge helper
├── pages/
│   ├── Home.jsx               # Trending infinite scroll
│   ├── Explore.jsx            # Search + filters + discover
│   ├── Movies.jsx             # Hero + carousels (movies)
│   ├── TvShows.jsx            # Hero + carousels (TV)
│   ├── MediaDetails.jsx       # Full details, trailer, cast, similar
│   ├── CategoryView.jsx       # Category infinite scroll
│   ├── Favorites.jsx          # Saved favorites grid
│   ├── WatchHistory.jsx       # Recently watched grid
│   ├── Settings.jsx           # Admin: movies & users CRUD
│   ├── Login.jsx              # Login form
│   ├── Signup.jsx             # Registration + verification prompt
│   ├── VerifyEmail.jsx        # Token verification handler
│   ├── ResendVerification.jsx # Resend verification email
│   └── NotFound.jsx           # Cinematic 404 page
├── services/
│   ├── api.js                 # Axios instance + backend endpoints
│   └── tmdb.js                # TMDB API functions
├── store/
│   ├── authSlice.js           # Redux auth slice (login, signup, profile)
│   ├── FavoritesContext.jsx   # Favorites context provider
│   └── store.js               # Redux store + token hydration
├── styles/
│   ├── index.scss             # Global styles & CSS variables
│   └── custom-select.scss     # Custom dropdown styling
├── App.jsx                    # Root: Provider + Router + Routes
└── main.jsx                   # Entry point
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** (or yarn/pnpm)
- A **TMDB API key** — [get one here](https://www.themoviedb.org/settings/api)
- The SheryCinema backend running (see backend README)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/SheryCinema.git
cd SheryCinema/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your TMDB API key and backend URL

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_API_URL=http://localhost:5000
```

| Variable            | Description                              |
| ------------------- | ---------------------------------------- |
| `VITE_TMDB_API_KEY` | API key from The Movie Database (TMDB)   |
| `VITE_API_URL`      | Base URL for the SheryCinema backend API |

---

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint across the project        |

---

## Routing

| Route                  | Page               | Access     | Description                        |
| ---------------------- | ------------------ | ---------- | ---------------------------------- |
| `/`                    | —                  | Public     | Redirects to `/home`               |
| `/login`               | Login              | Guest only | Username & password login          |
| `/signup`              | Signup             | Guest only | Registration + email verification  |
| `/resend-verification` | ResendVerification | Guest only | Request a new verification email   |
| `/verify-email`        | VerifyEmail        | Public     | Handles email verification tokens  |
| `/home`                | Home               | Protected  | Trending content feed              |
| `/explore`             | Explore            | Protected  | Search, filters & discovery        |
| `/movies`              | Movies             | Protected  | Movies hub with hero & carousels   |
| `/tv`                  | TvShows            | Protected  | TV shows hub with hero & carousels |
| `/category`            | CategoryView       | Protected  | Dynamic category infinite scroll   |
| `/:mediaType/:id`      | MediaDetails       | Protected  | Full media details & trailer       |
| `/favorites`           | Favorites          | Protected  | Saved favorites                    |
| `/recent`              | WatchHistory       | Protected  | Watch history                      |
| `/settings`            | Settings           | Admin only | Movies & users management          |

---

## Architecture

### State Management

- **Redux Toolkit** manages authentication — login, signup, profile, and token hydration from `localStorage` on app startup.
- **React Context** manages favorites — with optimistic add/remove, quick `isFavorite()` lookups, and automatic backend sync.

### API Layer

- **Axios instance** with a request interceptor that attaches the JWT from `localStorage` and `withCredentials: true` for cookie support.
- **TMDB service** wraps all TMDB v3 endpoints (trending, popular, top rated, search, discover, details with credits/videos/similar, genre lists).
- **Backend API service** handles auth, favorites CRUD, watch history, and admin operations.

### Key Patterns

- **JWT + localStorage** — token persists across sessions; auto-attached to every backend request
- **Optimistic UI** — favorites toggle immediately; rolls back on API failure
- **Debounced search** — 700ms delay prevents excessive API calls during typing
- **Infinite scroll** — Intersection Observer-based pagination for content grids
- **URL-driven filters** — Explore page reads `?q=` from the URL for shareable/bookmarkable searches
- **Hero banner randomization** — randomly picks from the top 5 trending items for variety
- **Fire-and-forget analytics** — watch history is recorded without blocking the UI

---

## Admin Panel

Accessible at `/settings` for users with the `admin` role.

**Movies Tab**

- Add movies with TMDB ID, metadata, genres, poster upload, and YouTube trailer URL
- Search and paginate the movie library
- Delete entries

**Users Tab**

- Search users by name or email
- Toggle role (user ↔ admin), ban/unban, verify/unverify email
- Permanently delete user accounts

---

## License

This project is part of the SheryCinema full-stack application.
