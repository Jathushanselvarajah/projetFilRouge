# Frontend Netflux

Frontend React/Vite de l'application Netflux.

## Lancement local

```bash
npm install
npm run dev
```

Par defaut, le frontend consomme l'API backend sur :

```text
http://localhost:3000/api
```

Pour utiliser une autre API au build :

```bash
VITE_API_URL=http://IP_BACK:3000/api npm run build
```

## Conteneurisation Docker

Le frontend est conteneurise avec une image multi-stage :

- stage `build` : installe les dependances et compile l'application Vite
- stage `runtime` : sert les fichiers statiques avec Nginx

Construire l'image :

```bash
docker build \
  -t netflux-frontend:local \
  --build-arg VITE_API_URL=http://localhost:3000/api \
  .
```

Lancer le conteneur :

```bash
docker run --rm \
  --name netflux-frontend \
  -p 8080:80 \
  netflux-frontend:local
```

Tester dans le navigateur :

```text
http://localhost:8080
```

## Verification

```bash
npm run lint
npm run build
```
