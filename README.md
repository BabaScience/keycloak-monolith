# Keycloak Monolith

Monolith skeleton with Node.js/Express (TypeScript) backend, React/Vite frontend, and Keycloak for local development. **Monorepo** (npm workspaces).

## Prerequisites

- Node.js 18+
- Docker (for Keycloak)

## Quick Start

### 1. Install all dependencies (from root)

```bash
npm install
```

This installs dependencies for both `backend` and `frontend` workspaces.

### 2. Backend

```bash
npm run dev:backend
```

Or from `backend/`: `npm run dev`

Server runs at http://localhost:3000. Health check: http://localhost:3000/health

### 3. Frontend

```bash
npm run dev:frontend
```

Or from `frontend/`: `npm run dev`

App runs at http://localhost:5173

### 4. Keycloak

**Option A – Docker Compose (recommended):**

```bash
docker compose up -d
```

**Option B – One-off run:**

```bash
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

Keycloak admin console: http://localhost:8080  
Login: **admin** / **admin**

## Project Structure (Monorepo)

```
keycloak-monolith/
├── package.json       # Root workspace config
├── backend/           # Express + TypeScript API
├── frontend/          # React + Vite app
├── docker-compose.yml
└── README.md
```

## Root Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:backend` | Start backend dev server |
| `npm run dev:frontend` | Start frontend dev server |
| `npm run build` | Build both backend and frontend |
| `npm run build:backend` | Build backend only |
| `npm run build:frontend` | Build frontend only |
