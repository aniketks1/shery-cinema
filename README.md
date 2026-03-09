# 🎬 SheryCinema

A full-stack movie & TV show discovery platform where users can explore trending content, search in real time, watch trailers, manage favorites, and track watch history — powered by the **TMDB API** with a custom **Node.js/Express** backend.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-ioredis-DC382D?logo=redis&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Admin Panel](#admin-panel)
- [License](#license)

---

## Overview

SheryCinema combines **TMDB's** vast movie/TV database with a custom backend that handles user authentication, favorites, watch history, and admin operations. The frontend delivers a cinematic dark-themed UI with smooth Framer Motion animations, infinite scroll, debounced search, and responsive design across all devices.

---

## Features

### Content Discovery

- **Trending Feed** — Infinite-scroll grid of trending movies & TV shows
- **Explore** — Debounced multi-search with media-type tabs, genre filters, and sort options
- **Movies Hub** — Hero banner, carousels for Trending, Top Rated, Upcoming, and genre content
- **TV Shows Hub** — Same hub layout tailored for TV-specific endpoints
- **Media Details** — Full info with backdrop, cast, production details, trailer playback, and recommendations

### User Features

- **Favorites** — Heart-toggle on any card with optimistic UI and backend sync
- **Watch History** — Auto-recorded on trailer playback, sorted newest-first
- **Email Verification** — Signup → verification email → token confirmation → login
- **Secure Auth** — JWT with HTTP-only cookies, Redis token blacklisting on logout

### Admin Panel

- **Movies CRUD** — Create/update/delete movies with poster upload (ImageKit CDN)
- **User Management** — Promote/demote roles, ban/unban, verify/unverify, delete users

### UI / UX

- Dark cinematic aesthetic with glass-panel auth and gradient overlays
- Framer Motion animations — staggered grids, spring physics, carousel slides
- Mobile-first responsive design (2 → 5 column grids)
- Fixed sidebar with active-tab indicator + mobile overlay menu
- Scroll-aware navbar with blur effect and inline search

---

## Tech Stack

### Frontend

| Category         | Technology                                                       |
| ---------------- | ---------------------------------------------------------------- |
| **Framework**    | React 19, Vite 7                                                 |
| **State**        | Redux Toolkit (auth), React Context (favorites)                  |
| **Routing**      | React Router DOM 7                                               |
| **Styling**      | Tailwind CSS 3.4, Sass, Framer Motion                            |
| **HTTP**         | Axios (JWT interceptor, `withCredentials`)                       |
| **UI Libraries** | Headless UI, Radix UI, Lucide React, CVA + clsx + tailwind-merge |
| **Data Source**  | TMDB API v3                                                      |

### Backend

| Category        | Technology                         |
| --------------- | ---------------------------------- |
| **Runtime**     | Node.js, Express 5                 |
| **Database**    | MongoDB (Mongoose 9)               |
| **Caching**     | Redis (ioredis) — JWT blacklisting |
| **Auth**        | JWT (jsonwebtoken), bcryptjs       |
| **File Upload** | Multer (in-memory) → ImageKit CDN  |
| **Email**       | Nodemailer (SMTP)                  |
| **Validation**  | express-validator                  |
| **Security**    | Helmet, CORS, HTTP-only cookies    |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT                                 │
│                                                                 │
│  React 19 + Redux Toolkit + React Router + Tailwind CSS         │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────────┐  │
│  │ TMDB API │  │ Auth (Redux) │  │ Favorites (Context + API) │  │
│  │ Service  │  │  Slice       │  │ Optimistic Updates        │  │
│  └────┬─────┘  └──────┬───────┘  └─────────────┬─────────────┘  │
│       │               │                        │                │
└───────┼───────────────┼────────────────────────┼────────────────┘
        │               │                        │
        ▼               ▼                        ▼
┌───────────────┐  ┌─────────────────────────────────────────────┐
│  TMDB API v3  │  │               BACKEND API                   │
│  (External)   │  │                                             │
│               │  │  Express 5 + Mongoose + JWT + Redis          │
│  • Trending   │  │                                             │
│  • Search     │  │  Routes → Controllers → Services → Models   │
│  • Details    │  │                                             │
│  • Genres     │  │  ┌─────────┐ ┌──────────┐ ┌─────────────┐  │
│  • Discover   │  │  │  Auth   │ │  Movie   │ │   Admin     │  │
│               │  │  │ Routes  │ │  Routes  │ │  Routes     │  │
│               │  │  └────┬────┘ └────┬─────┘ └──────┬──────┘  │
└───────────────┘  │       │           │              │          │
                   │       ▼           ▼              ▼          │
                   │  ┌──────────────────────────────────────┐   │
                   │  │          MongoDB (Mongoose)          │   │
                   │  │  Users | Movies | Favorites | History│   │
                   │  └──────────────────────────────────────┘   │
                   │                                             │
                   │  ┌───────────────┐  ┌───────────────────┐   │
                   │  │ Redis (ioredis)│  │ ImageKit (CDN)    │   │
                   │  │ Token Blacklist│  │ Poster Storage    │   │
                   │  └───────────────┘  └───────────────────┘   │
                   └─────────────────────────────────────────────┘
```

---

## Project Structure

```
SheryCinema/
├── backend/
│   ├── index.js                        # Entry point — DB & server init
│   ├── package.json
│   └── src/
│       ├── app.js                      # Express config, middleware, routes
│       ├── config/
│       │   ├── cache.js                # Redis client singleton
│       │   └── database.js             # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js      # Register, login, logout, verify
│       │   ├── movie.controller.js     # Favorites & watch history
│       │   └── admin.controller.js     # Movie & user CRUD
│       ├── middlewares/
│       │   ├── auth.middleware.js       # JWT verification + ban check
│       │   ├── admin.middleware.js      # Role-based access control
│       │   ├── error.middleware.js      # Global error handler
│       │   └── upload.middleware.js     # Multer (10MB, image-only)
│       ├── models/
│       │   ├── user.model.js           # User schema + bcrypt hooks
│       │   ├── movie.model.js          # Movie schema
│       │   ├── favorites.model.js      # Favorites (userId + tmdbId)
│       │   └── watchHistory.model.js   # Watch history tracking
│       ├── routes/
│       │   ├── auth.route.js           # /auth/*
│       │   ├── movie.route.js          # /movie/*
│       │   └── admin.route.js          # /admin/*
│       ├── services/
│       │   ├── auth.service.js         # Auth business logic
│       │   ├── movie.service.js        # Favorites & history logic
│       │   ├── admin.service.js        # Admin CRUD logic
│       │   ├── mail.service.js         # Email sending wrapper
│       │   └── fileUpload.service.js   # ImageKit upload/delete
│       ├── templates/
│       │   └── emailTemplates.js       # HTML verification email
│       ├── utils/
│       │   ├── appError.js             # Custom error class
│       │   ├── asyncHandler.js         # Async error wrapper
│       │   ├── mailer.js               # Nodemailer transporter
│       │   └── token.js               # JWT generate/verify helpers
│       └── validation/
│           ├── auth.validation.js      # Register & login validators
│           └── admin.validation.js     # Movie & user validators
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx                     # Root: Provider + Router + Routes
│       ├── main.jsx                    # Entry point
│       ├── components/
│       │   ├── layouts/
│       │   │   ├── AuthLayout.jsx      # Glass-panel auth wrapper
│       │   │   └── MainLayout.jsx      # Sidebar + Navbar + content
│       │   ├── shared/
│       │   │   ├── AdminRoute.jsx      # Admin role guard
│       │   │   ├── Navbar.jsx          # Top bar with search
│       │   │   ├── ProtectedRoute.jsx  # Auth guard
│       │   │   ├── ScrollToTop.jsx     # Auto-scroll on navigate
│       │   │   └── Sidebar.jsx         # Fixed sidebar navigation
│       │   └── ui/
│       │       ├── HeroBanner.jsx      # Backdrop hero with CTAs
│       │       ├── MediaCarousel.jsx   # Horizontal snap-scroll
│       │       ├── MovieCard.jsx       # Poster card + fav toggle
│       │       └── SkeletonCard.jsx    # Loading placeholder
│       ├── hooks/
│       │   ├── useDebounce.js          # 700ms debounce hook
│       │   └── useFavorites.js         # Favorites context consumer
│       ├── lib/
│       │   └── utils.js               # cn() helper (clsx + twMerge)
│       ├── pages/                      # 14 page components
│       ├── services/
│       │   ├── api.js                  # Axios instance + backend API
│       │   └── tmdb.js                 # TMDB API wrapper
│       ├── store/
│       │   ├── authSlice.js            # Redux auth slice
│       │   ├── FavoritesContext.jsx    # Favorites context provider
│       │   └── store.js               # Redux store + hydration
│       └── styles/
│           ├── index.scss              # Global styles & CSS vars
│           └── custom-select.scss      # Dropdown styling
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** instance (local or Atlas)
- **Redis** server (for token blacklisting)
- **TMDB API key** — [get one here](https://www.themoviedb.org/settings/api)
- **ImageKit account** — [sign up here](https://imagekit.io/) (for poster uploads)
- **SMTP credentials** (Gmail, Mailtrap, etc. for verification emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/SheryCinema.git
cd SheryCinema
```

#### Backend

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Fill in all required values in .env (see Environment Variables below)

# Start development server
npm run dev
```

#### Frontend

```bash
cd frontend
npm install

# Configure environment
cp .env.example .env
# Add your TMDB API key and backend URL

# Start development server
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at the configured `PORT` (default `3000`).

---

## Environment Variables

### Backend (`backend/.env`)

| Variable                 | Description                  | Example                      |
| ------------------------ | ---------------------------- | ---------------------------- |
| `PORT`                   | Server port                  | `3000`                       |
| `NODE_ENV`               | Environment mode             | `development` / `production` |
| `FRONTEND_URL`           | Frontend origin for CORS     | `http://localhost:5173`      |
| `JWT_SECRET`             | Secret key for signing JWTs  | (any strong random string)   |
| `MONGODB_URI`            | MongoDB connection string    | `mongodb+srv://...`          |
| `DB_NAME`                | Database name                | `sherycinema`                |
| `REDIS_HOST`             | Redis server host            | `localhost`                  |
| `REDIS_PORT`             | Redis server port            | `6379`                       |
| `REDIS_PASSWORD`         | Redis password (optional)    | —                            |
| `EMAIL_HOST`             | SMTP host                    | `smtp.gmail.com`             |
| `EMAIL_PORT`             | SMTP port                    | `587`                        |
| `EMAIL_SECURE`           | Use SSL (true for port 465)  | `false`                      |
| `EMAIL_USER`             | SMTP username / email        | `you@gmail.com`              |
| `EMAIL_PASS`             | SMTP password / app password | —                            |
| `IMAGE_KIT_PUBLIC_KEY`   | ImageKit public key          | —                            |
| `IMAGE_KIT_PRIVATE_KEY`  | ImageKit private key         | —                            |
| `IMAGE_KIT_URL_ENDPOINT` | ImageKit URL endpoint        | `https://ik.imagekit.io/...` |

### Frontend (`frontend/.env`)

| Variable            | Description          | Example                 |
| ------------------- | -------------------- | ----------------------- |
| `VITE_TMDB_API_KEY` | TMDB API key         | (from TMDB dashboard)   |
| `VITE_API_URL`      | Backend API base URL | `http://localhost:3000` |

---

## API Reference

### Authentication

| Method | Endpoint                          | Auth   | Description                    |
| ------ | --------------------------------- | ------ | ------------------------------ |
| POST   | `/auth/register`                  | Public | Register a new user            |
| PATCH  | `/auth/verify-email`              | Public | Verify email with token        |
| POST   | `/auth/resend-verification-email` | Public | Resend verification email      |
| POST   | `/auth/login`                     | Public | Login (returns JWT)            |
| POST   | `/auth/logout`                    | Auth   | Blacklist token & clear cookie |
| GET    | `/auth/me`                        | Auth   | Get current user profile       |

### Movies / Favorites / History

| Method | Endpoint                  | Auth | Description           |
| ------ | ------------------------- | ---- | --------------------- |
| POST   | `/movie/favorite/:tmdbId` | Auth | Add to favorites      |
| GET    | `/movie/favorites`        | Auth | Get all favorites     |
| DELETE | `/movie/favorite/:tmdbId` | Auth | Remove from favorites |
| POST   | `/movie/history/:tmdbId`  | Auth | Record watch history  |
| GET    | `/movie/history`          | Auth | Get watch history     |

### Admin

| Method | Endpoint                | Auth  | Description                       |
| ------ | ----------------------- | ----- | --------------------------------- |
| POST   | `/admin/movie`          | Admin | Create movie (with poster upload) |
| GET    | `/admin/movie`          | Admin | List movies (paginated)           |
| PATCH  | `/admin/movie/:movieId` | Admin | Update movie                      |
| DELETE | `/admin/movie/:movieId` | Admin | Delete movie + cleanup refs       |
| GET    | `/admin/user`           | Admin | List users (paginated)            |
| PATCH  | `/admin/user/:userId`   | Admin | Update user (role, ban, verify)   |
| DELETE | `/admin/user/:userId`   | Admin | Delete user + all related data    |

---

## Database Schema

### Users

| Field        | Type    | Constraints                                             |
| ------------ | ------- | ------------------------------------------------------- |
| `fullName`   | String  | Required, min 3 chars                                   |
| `username`   | String  | Required, unique, indexed, 3–30 chars                   |
| `email`      | String  | Required, unique, indexed, valid email                  |
| `password`   | String  | Required, hashed (bcrypt), 6–12 chars, complexity rules |
| `role`       | Enum    | `"user"` (default) or `"admin"`                         |
| `isVerified` | Boolean | Default `false`                                         |
| `isBanned`   | Boolean | Default `false`                                         |

### Movies

| Field               | Type     | Constraints                 |
| ------------------- | -------- | --------------------------- |
| `tmdbId`            | String   | Required, unique, indexed   |
| `title`             | String   | Required                    |
| `description`       | String   | Required                    |
| `category`          | Enum     | `"movie"` or `"tv-show"`    |
| `posterUrl`         | String   | Required (ImageKit CDN URL) |
| `youTubeTrailerUrl` | String   | Required, valid URL         |
| `genres`            | [String] | Required, at least 1        |
| `releaseDate`       | Date     | Required                    |

### Favorites

| Field       | Type     | Constraints           |
| ----------- | -------- | --------------------- |
| `userId`    | ObjectId | Ref → Users, required |
| `tmdbId`    | String   | Required              |
| `mediaType` | Enum     | `"movie"` or `"tv"`   |

Compound unique index on `(userId, tmdbId)`.

### Watch History

| Field       | Type     | Constraints           |
| ----------- | -------- | --------------------- |
| `user`      | ObjectId | Ref → Users, required |
| `tmdbId`    | String   | Required              |
| `mediaType` | Enum     | `"movie"` or `"tv"`   |

Compound unique index on `(user, tmdbId)`.

---

## Authentication Flow

```
                    ┌──────────────┐
                    │   /signup    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  POST /auth  │
                    │  /register   │
                    └──────┬───────┘
                           │
                    ┌──────▼───────────┐
                    │ Verification     │
                    │ email sent       │
                    │ (10-min token)   │
                    └──────┬───────────┘
                           │
                    ┌──────▼───────────┐
                    │ User clicks      │
                    │ email link       │
                    └──────┬───────────┘
                           │
                    ┌──────▼───────────┐
                    │ PATCH /auth      │
                    │ /verify-email    │
                    │ → isVerified=true│
                    │ → JWT issued     │
                    └──────┬───────────┘
                           │
              ┌────────────▼────────────┐
              │    Authenticated User   │
              │  (7-day JWT in cookie   │
              │   + localStorage)       │
              └────────────┬────────────┘
                           │
               ┌───────────┼───────────┐
               │           │           │
        ┌──────▼──┐  ┌─────▼────┐ ┌───▼────────┐
        │ Browse  │  │ Manage   │ │  POST      │
        │ content │  │ favorites│ │  /auth     │
        │ via     │  │ & watch  │ │  /logout   │
        │ TMDB    │  │ history  │ │  (blacklist│
        └─────────┘  └──────────┘ │   token)   │
                                  └────────────┘
```

**Security measures:**

- Passwords hashed with **bcrypt** (salt rounds: 10)
- JWTs signed with HS256, stored in HTTP-only + Secure + SameSite cookies
- Token blacklisting on logout via **Redis** with automatic TTL expiration
- Ban status checked on every authenticated request
- Admin routes protected by role-based middleware

---

## Admin Panel

Accessible at `/settings` — restricted to users with `role: "admin"`.

### Movies Management

- Create movies with TMDB ID, title, description, category, genres, release date, YouTube trailer URL, and poster image
- Poster images uploaded to **ImageKit CDN**
- Search, paginate, and delete movies from the library
- Deleting a movie auto-removes it from all users' favorites and history

### User Management

- View all users with search (name / email) and pagination
- **Toggle role** — promote to admin or demote to user
- **Ban / Unban** — banned users cannot authenticate
- **Verify / Unverify** — manually toggle email verification
- **Delete** — permanently removes user and all associated favorites, history, and movies

---

## Scripts

### Backend

| Command       | Description                      |
| ------------- | -------------------------------- |
| `npm start`   | Start production server          |
| `npm run dev` | Start with nodemon (auto-reload) |

### Frontend

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR   |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint                       |

---

## License

This project is part of the SheryCinema full-stack application.
