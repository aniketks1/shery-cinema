# 🎬 Shery Cinema — Backend API

The backend server for **Shery Cinema**, a full-stack movie platform. Built with **Express 5**, **MongoDB**, and **Redis**, it provides RESTful APIs for authentication, movie management, user favorites, watch history, and admin operations.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Auth Routes](#auth-routes)
  - [Movie Routes](#movie-routes)
  - [Admin Routes](#admin-routes)
- [Data Models](#data-models)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Author](#author)

---

## Tech Stack

| Technology               | Purpose                             |
| ------------------------ | ----------------------------------- |
| **Express 5**            | Web framework                       |
| **MongoDB / Mongoose 9** | Database & ODM                      |
| **Redis (ioredis)**      | Token blacklisting & caching        |
| **JWT**                  | Authentication                      |
| **bcryptjs**             | Password hashing                    |
| **ImageKit**             | Image upload & CDN                  |
| **Nodemailer**           | Email service (verification emails) |
| **Multer**               | File upload handling                |
| **Helmet**               | Security headers                    |
| **express-validator**    | Request validation                  |

---

## Project Structure

```
backend/
├── index.js                    # Entry point — DB connection & server start
├── package.json
└── src/
    ├── app.js                  # Express app configuration & route mounting
    ├── config/
    │   ├── cache.js            # Redis client setup
    │   └── database.js         # MongoDB connection
    ├── controllers/
    │   ├── admin.controller.js # Admin CRUD operations
    │   ├── auth.controller.js  # Auth flow (register, login, logout, verify)
    │   └── movie.controller.js # Favorites & watch history
    ├── middlewares/
    │   ├── admin.middleware.js  # Role-based admin guard
    │   ├── auth.middleware.js   # JWT verification & ban check
    │   ├── error.middleware.js  # Global error handler
    │   └── upload.middleware.js # Multer config (image uploads)
    ├── models/
    │   ├── favorites.model.js  # User favorites (userId + tmdbId)
    │   ├── movie.model.js      # Movie schema
    │   ├── user.model.js       # User schema with password hashing
    │   └── watchHistory.model.js # Watch history
    ├── routes/
    │   ├── admin.route.js      # /admin/*
    │   ├── auth.route.js       # /auth/*
    │   └── movie.route.js      # /movie/*
    ├── services/               # Business logic layer
    │   ├── admin.service.js
    │   ├── auth.service.js
    │   ├── fileUpload.service.js
    │   ├── mail.service.js
    │   └── movie.service.js
    ├── templates/
    │   └── emailTemplates.js   # HTML email templates
    ├── utils/
    │   ├── appError.js         # Custom operational error class
    │   ├── asyncHandler.js     # Async wrapper for controllers
    │   ├── mailer.js           # Nodemailer transporter
    │   └── token.js            # JWT generate & verify helpers
    └── validation/
        ├── admin.validation.js # Admin route validators
        └── auth.validation.js  # Auth route validators
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** instance (local or Atlas)
- **Redis** server (used for token blacklisting on logout)
- **ImageKit** account (for poster image uploads)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SheryCinema/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env   # then fill in the values (see below)
```

### Running

```bash
# Development (with hot-reload via nodemon)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:5000` by default (configurable via `PORT`).

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

| Variable                 | Required | Description                            |
| ------------------------ | :------: | -------------------------------------- |
| `PORT`                   |          | Server port (default: `5000`)          |
| `NODE_ENV`               |          | `development` or `production`          |
| `MONGODB_URI`            |    ✅    | MongoDB connection string              |
| `DB_NAME`                |    ✅    | Database name                          |
| `JWT_SECRET`             |    ✅    | Secret key for signing JWTs            |
| `FRONTEND_URL`           |          | Frontend origin for CORS & email links |
| `REDIS_HOST`             |          | Redis server host                      |
| `REDIS_PORT`             |          | Redis server port                      |
| `REDIS_PASS`             |          | Redis password                         |
| `EMAIL_HOST`             |          | SMTP host                              |
| `EMAIL_PORT`             |          | SMTP port                              |
| `EMAIL_SECURE`           |          | `true` for port 465, `false` otherwise |
| `EMAIL_USER`             |          | SMTP username / sender email           |
| `EMAIL_PASS`             |          | SMTP password                          |
| `IMAGE_KIT_PUBLIC_KEY`   |          | ImageKit public key                    |
| `IMAGE_KIT_PRIVATE_KEY`  |          | ImageKit private key                   |
| `IMAGE_KIT_URL_ENDPOINT` |          | ImageKit URL endpoint                  |

---

## API Reference

**Base URL:** `http://localhost:5000`

All responses follow the format:

```json
{
	"success": true,
	"message": "...",
	"data": {}
}
```

### Auth Routes

| Method  | Endpoint                          | Access  | Description                    |
| ------- | --------------------------------- | ------- | ------------------------------ |
| `POST`  | `/auth/register`                  | Public  | Register a new user            |
| `PATCH` | `/auth/verify-email`              | Public  | Verify email with token        |
| `POST`  | `/auth/resend-verification-email` | Public  | Resend verification email      |
| `POST`  | `/auth/login`                     | Public  | Login & receive auth cookie    |
| `POST`  | `/auth/logout`                    | Private | Logout & blacklist token       |
| `GET`   | `/auth/me`                        | Private | Get authenticated user profile |

#### Register

```
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Pass@123"
}
```

#### Login

```
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "Pass@123"
}
```

> Authentication token is set as an **httpOnly cookie** (`token`) valid for 7 days.

---

### Movie Routes

All movie routes require authentication (token cookie or `Authorization: Bearer <token>` header).

| Method   | Endpoint                  | Access  | Description                 |
| -------- | ------------------------- | ------- | --------------------------- |
| `POST`   | `/movie/favorite/:tmdbId` | Private | Add movie to favorites      |
| `GET`    | `/movie/favorites`        | Private | Get user's favorite movies  |
| `DELETE` | `/movie/favorite/:tmdbId` | Private | Remove movie from favorites |
| `POST`   | `/movie/history/:tmdbId`  | Private | Add movie to watch history  |
| `GET`    | `/movie/history`          | Private | Get user's watch history    |

---

### Admin Routes

All admin routes require authentication **and** admin role.

| Method   | Endpoint                | Description                                                 |
| -------- | ----------------------- | ----------------------------------------------------------- |
| `POST`   | `/admin/movie`          | Create a new movie (multipart: `poster` file + JSON fields) |
| `GET`    | `/admin/movie`          | List movies (paginated: `?page=1&limit=20`)                 |
| `PATCH`  | `/admin/movie/:movieId` | Update movie details                                        |
| `DELETE` | `/admin/movie/:movieId` | Delete a movie                                              |
| `GET`    | `/admin/user`           | List users (paginated)                                      |
| `PATCH`  | `/admin/user/:userId`   | Update user (role, ban, verify status)                      |
| `DELETE` | `/admin/user/:userId`   | Delete a user                                               |

#### Create Movie (Admin)

```
POST /admin/movie
Content-Type: multipart/form-data

Fields:
  poster       — Image file (JPG, PNG, or WEBP, max 10 MB)
  tmdbId       — TMDB ID (string)
  title        — Movie title
  description  — Movie description
  category     — "movie" or "tv-show"
  youTubeTrailerUrl — Valid YouTube URL
  genres       — Comma-separated genres (e.g. "Action, Drama")
  releaseDate  — ISO 8601 date
```

---

## Data Models

### User

| Field        | Type    | Notes                           |
| ------------ | ------- | ------------------------------- |
| `fullName`   | String  | Required, trimmed               |
| `username`   | String  | Required, unique, indexed       |
| `email`      | String  | Required, unique, validated     |
| `password`   | String  | 6-12 chars, hashed with bcrypt  |
| `role`       | String  | `"user"` (default) or `"admin"` |
| `isVerified` | Boolean | Email verification status       |
| `isBanned`   | Boolean | Account ban status              |

### Movie

| Field               | Type     | Notes                     |
| ------------------- | -------- | ------------------------- |
| `tmdbId`            | String   | Required, unique, indexed |
| `title`             | String   | Required                  |
| `description`       | String   | Required                  |
| `category`          | String   | `"movie"` or `"tv-show"`  |
| `posterUrl`         | String   | ImageKit URL              |
| `youTubeTrailerUrl` | String   | Validated YouTube URL     |
| `genres`            | [String] | Array of genre names      |
| `releaseDate`       | Date     | Required                  |

### Favorites

| Field    | Type     | Notes         |
| -------- | -------- | ------------- |
| `userId` | ObjectId | Ref → users   |
| `tmdbId` | String   | TMDB movie ID |

Compound unique index on `(userId, tmdbId)`.

### Watch History

| Field    | Type     | Notes         |
| -------- | -------- | ------------- |
| `user`   | ObjectId | Ref → users   |
| `tmdbId` | String   | TMDB movie ID |

Compound unique index on `(user, tmdbId)`.

---

## Middleware

| Middleware            | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| **Helmet**            | Sets secure HTTP headers                                                   |
| **CORS**              | Allows `localhost:5173` and `FRONTEND_URL` with credentials                |
| **Auth Middleware**   | Verifies JWT from cookie/header, checks Redis blacklist, checks ban status |
| **Admin Middleware**  | Ensures `req.user.role === "admin"`                                        |
| **Upload Middleware** | Multer memory storage; accepts JPG, PNG, WEBP up to 10 MB                  |
| **Error Middleware**  | Global error handler with separate dev/prod responses                      |

---

## Error Handling

The API uses a custom `AppError` class for operational errors. Errors are caught by the `asyncHandler` wrapper and forwarded to the global error middleware.

- **Development** — returns `status`, `message`, and `stack` trace.
- **Production** — returns only `status` and `message` for operational errors; generic `"Something went wrong!"` for unexpected errors.

**Common HTTP status codes:**

| Code  | Meaning                                   |
| ----- | ----------------------------------------- |
| `400` | Bad Request / Validation error            |
| `401` | Unauthorized (missing or invalid token)   |
| `403` | Forbidden (banned user, non-admin access) |
| `404` | Resource not found                        |
| `500` | Internal server error                     |

---

## Author

**Aniket Kumar Singh**

---

## License

ISC
