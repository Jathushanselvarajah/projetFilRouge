# Projet Fil Rouge

Projet DevOps - API NodeJS + Frontend React | Cours Projet Pipeline - Efrei 2026

## Structure

```
projetFilRouge/
├── backend/     # API NodeJS (Express)
├── frontend/    # Frontend React (Vite)
```

## Lancer le projet

### Backend

```bash
cd backend
npm install
npm start
```

→ API disponible sur `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

→ App disponible sur `http://localhost:5173`

### Avec Docker Compose

```bash
docker compose up -d
docker exec api-films node migrations/migrate.js
docker exec api-films node seeds/seed.js
```

→ MySQL + API lancés automatiquement

### Auteurs

SELVARAJAH Jathushan & BAZELAIRE Colin
