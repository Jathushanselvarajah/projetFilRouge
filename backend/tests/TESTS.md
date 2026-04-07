# Documentation des Tests Backend

## Lancer les tests

```bash
cd backend
npm test
```

Les tests s'exécutent avec `NODE_ENV=test` et n'utilisent pas le fichier `.env` de production.

## Tests unitaires (`tests/unit/validation.test.js`)

Vérifient la vraie fonction de validation métier d'un film sans connexion à la base de données.

- Titre obligatoire (vide ou null)
- Année valide (entre 1888 et aujourd'hui + 5 ans)
- Année chaîne convertie en entier
- Format de l'URL de l'image (doit commencer par http ou https)
- Genre doit être une chaîne de caractères
- Description doit être une chaîne de caractères

## Tests d'intégration (`tests/integration/api.test.js`)

Vérifient les routes API en traversant toute l'application Express avec un dépôt mémoire isolé.

- `GET /api` → retourne le message de bienvenue
- `GET /api/films` → retourne la liste des films
- `POST /api/films` → crée un nouveau film
- `POST /api/films` invalide → retourne 400
- `GET /api/films/:id` → retourne un film par son ID
- `GET /api/films/:id` avec un ID inexistant → retourne 404
- `PUT /api/films/:id` → modifie un film existant
- `PUT /api/films/:id` invalide → retourne 400
- `PUT /api/films/:id` avec un ID inexistant → retourne 404
- `DELETE /api/films/:id` → supprime un film existant
- `DELETE /api/films/:id` avec un ID inexistant → retourne 404

## Outils

- **Jest** : framework de test
- **Client HTTP Node isolé** : exécute les requêtes sans démarrer de port réseau
