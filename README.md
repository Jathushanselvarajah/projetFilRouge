# Projet Fil Rouge

Projet DevOps - API NodeJS + Frontend React | Cours Projet Pipeline - Efrei 2026

## Vue d'ensemble

L'application est composee de deux parties :

- `backend/` : API Node.js Express exposee sur `/api`
- `frontend/` : application React/Vite consommant l'API
- `docker-compose.yml` : stack backend avec API + MySQL
- `backend/Jenkinsfile` : pipeline CI/CD backend
- `frontend/Jenkinsfile` : pipeline CI/CD frontend

Architecture cible :

```text
Utilisateur
  |
  | HTTP :80
  v
VM Front Azure
  - Jenkins :8080
  - Frontend React servi par Nginx :80
  |
  | HTTP vers VITE_API_URL
  v
VM Back Azure
  - API Node/Express :3000
  - MySQL 8 en reseau Docker interne
```

## Infrastructure Azure

### VM Front

Role :

- heberger Jenkins
- heberger le frontend React build en fichiers statiques
- servir le frontend via un conteneur `nginx:alpine`

Ports a ouvrir :

- `22` : SSH
- `80` : frontend public
- `8080` : Jenkins, si Jenkins est installe sur cette VM

### VM Back

Role :

- heberger le backend Node.js
- heberger MySQL 8 via Docker Compose
- exposer uniquement l'API au frontend

Ports a ouvrir :

- `22` : SSH
- `3000` : API backend

Le port MySQL `3306` ne doit pas etre ouvert publiquement. La base est accessible uniquement par le conteneur backend via le reseau Docker interne.

## Variables d'environnement

### Backend Docker Compose

Creer un fichier `.env` a la racine du projet sur la VM backend, a partir de `.env.example`.

Exemple :

```env
MYSQL_ROOT_PASSWORD=change-this-root-password
MYSQL_DATABASE=movies
MYSQL_USER=app_user
MYSQL_PASSWORD=change-this-app-password

NODE_ENV=production
PORT=3000
DB_PORT=3306
CORS_ORIGIN=http://IP_OU_DNS_DU_FRONT
```

Le fichier `.env` contient des secrets et ne doit jamais etre pousse dans Git.

### Backend sans Docker Compose

Pour lancer uniquement le backend avec `npm start`, utiliser `backend/.env.example` comme modele :

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=projet_fil_rouge
DB_PORT=3306
```

### Frontend

Le frontend utilise `VITE_API_URL` au moment du build.

Exemple local :

```bash
VITE_API_URL=http://localhost:3000/api npm run build
```

Exemple production :

```bash
VITE_API_URL=http://IP_OU_DNS_DU_BACK:3000/api npm run build
```

## Lancement local

### Backend seul

```bash
cd backend
npm install
npm start
```

API disponible sur `http://localhost:3000/api`.

### Frontend seul

```bash
cd frontend
npm install
npm run dev
```

Application disponible sur `http://localhost:5173`.

### Stack backend avec Docker Compose

```bash
cp .env.example .env
docker compose --env-file .env up -d --build
docker compose --env-file .env exec -T backend npm run migrate
docker compose --env-file .env exec -T backend npm run seed
```

Verification :

```bash
curl http://localhost:3000/api
curl http://localhost:3000/api/films
```

## Conteneurisation Docker

### Backend

Le backend est conteneurise avec `backend/Dockerfile`.

L'image installe uniquement les dependances de production et lance l'API Express sur le port `3000`.

Construire l'image backend :

```bash
docker build -t netflux-backend:local ./backend
```

Le backend a besoin d'une base MySQL. Pour lancer l'API avec sa base, utiliser Docker Compose :

```bash
cp .env.example .env
docker compose --env-file .env up -d --build db backend
docker compose --env-file .env exec -T backend npm run migrate
docker compose --env-file .env exec -T backend npm run seed
```

Tester :

```bash
curl http://localhost:3000/api
```

### Frontend

Le frontend est conteneurise avec `frontend/Dockerfile`.

L'image compile l'application React/Vite, puis sert le dossier `dist` avec Nginx sur le port `80`.

Construire l'image frontend :

```bash
docker build \
  -t netflux-frontend:local \
  --build-arg VITE_API_URL=http://localhost:3000/api \
  ./frontend
```

Lancer le frontend :

```bash
docker run --rm \
  --name netflux-frontend \
  -p 8080:80 \
  netflux-frontend:local
```

Tester :

```text
http://localhost:8080
```

## Tests

### Backend

```bash
cd backend
npm test
```

Les tests backend sont isoles de la base de production. Les tests d'integration traversent l'application Express avec un depot memoire.

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

Si des tests frontend sont ajoutes, les lancer avec la commande documentee dans `frontend/package.json`.

## CI/CD Jenkins

Deux jobs Jenkins sont prevus, tous les deux en mode `Pipeline from SCM`.

### SonarQube

SonarQube est utilise pour analyser la qualite du code frontend et backend.

Lancer SonarQube en local sur la VM Jenkins :

```bash
docker run -d \
  --name sonarqube \
  --restart unless-stopped \
  -p 9000:9000 \
  sonarqube:community
```

Interface :

```text
http://192.168.64.7:9000
```

Creer deux projets manuels dans SonarQube :

- `netflux-backend`
- `netflux-frontend`

Creer ensuite un token SonarQube et le stocker dans Jenkins Credentials :

- Kind : `Secret text`
- ID : `sonarqube-token`
- Secret : token genere dans SonarQube

Les analyses peuvent aussi etre lancees localement :

```bash
cd backend
npm run sonar -- -Dsonar.host.url=http://192.168.64.7:9000 -Dsonar.token=TOKEN
```

```bash
cd frontend
npm run sonar -- -Dsonar.host.url=http://192.168.64.7:9000 -Dsonar.token=TOKEN
```

### Job backend

Configuration :

- Repository URL : `https://github.com/Jathushanselvarajah/projetFilRouge.git`
- Branch : `main`
- Script Path : `backend/Jenkinsfile`

Parametres Jenkins :

- `GIT_BRANCH` : branche a deployer, par defaut `main`
- `BACKEND_HOST` : IP publique ou DNS de la VM backend
- `BACKEND_USER` : utilisateur SSH, par defaut `azureuser`
- `REMOTE_APP_DIR` : dossier du projet sur la VM backend
- `SSH_CREDENTIALS_ID` : ID du credential SSH Jenkins
- `RUN_SEED` : executer le seed apres migration
- `DOCKERHUB_CREDENTIALS_ID` : ID du credential DockerHub Jenkins
- `BACKEND_IMAGE` : image DockerHub backend, par defaut `jathus/netflux-backend`
- `SONAR_HOST_URL` : URL du serveur SonarQube
- `SONAR_TOKEN_CREDENTIALS_ID` : ID Jenkins du token SonarQube

Etapes :

- checkout du repository
- installation des dependances backend
- execution des tests backend
- analyse SonarQube backend
- validation de Docker Compose
- delivery DockerHub : build et push de l'image backend
- deploiement sur la VM backend en SSH
- `docker compose up -d --build db backend`
- migration
- seed optionnel
- smoke test local et public

Prerequis VM backend :

- `git`
- `docker`
- acces SSH depuis Jenkins
- fichier `.env` present dans `REMOTE_APP_DIR`

### Job frontend

Configuration :

- Repository URL : `https://github.com/Jathushanselvarajah/projetFilRouge.git`
- Branch : `main`
- Script Path : `frontend/Jenkinsfile`

Parametres Jenkins :

- `GIT_BRANCH` : branche a deployer, par defaut `main`
- `FRONTEND_HOST` : IP publique ou DNS de la VM frontend
- `FRONTEND_USER` : utilisateur SSH, par defaut `azureuser`
- `REMOTE_APP_DIR` : dossier de deploiement du frontend sur la VM
- `SSH_CREDENTIALS_ID` : ID du credential SSH Jenkins
- `VITE_API_URL` : URL publique du backend, exemple `http://IP_BACK:3000/api`
- `FRONTEND_PORT` : port public du frontend, par defaut `80`
- `DOCKERHUB_CREDENTIALS_ID` : ID du credential DockerHub Jenkins
- `FRONTEND_IMAGE` : image DockerHub frontend, par defaut `jathus/netflux-frontend`
- `SONAR_HOST_URL` : URL du serveur SonarQube
- `SONAR_TOKEN_CREDENTIALS_ID` : ID Jenkins du token SonarQube

Etapes :

- checkout du repository
- installation des dependances frontend
- lint frontend
- build Vite avec `VITE_API_URL`
- analyse SonarQube frontend
- delivery DockerHub : build et push de l'image frontend
- packaging de `frontend/dist`
- envoi du build sur la VM frontend
- lancement d'un conteneur `nginx:alpine`
- smoke test local et public

### Credential DockerHub Jenkins

Creer un credential Jenkins de type `Username with password` :

- ID : `dockerhub-credentials`
- Username : utilisateur DockerHub, par exemple `jathus`
- Password : token DockerHub, pas le mot de passe du compte

Les Jenkinsfiles utilisent ce credential pour executer `docker login`, puis publier les images :

- `jathus/netflux-backend:latest`
- `jathus/netflux-backend:<BUILD_NUMBER>`
- `jathus/netflux-frontend:latest`
- `jathus/netflux-frontend:<BUILD_NUMBER>`

Prerequis VM frontend :

- `docker`
- acces SSH depuis Jenkins
- port `80` ouvert

## Securite

- Ne jamais commiter `.env`.
- Ne jamais mettre de mot de passe dans un Jenkinsfile.
- Les cles SSH doivent etre stockees dans Jenkins Credentials.
- Les mots de passe MySQL doivent rester dans le `.env` de la VM backend.
- Le port `3306` de MySQL ne doit pas etre expose sur Internet.
- `CORS_ORIGIN` doit pointer vers l'URL reelle du frontend en production.

## Auteurs

SELVARAJAH Jathushan & BAZELAIRE Colin
