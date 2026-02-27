# Documentation des Tests Backend

## Lancer les tests

```bash
cd backend
npm test
```

## Tests unitaires (`tests/unit/validation.test.js`)

Vérifient la validation des données d'un film sans connexion à la base de données.

- Titre obligatoire (vide ou null)
- Année valide (entre 1888 et aujourd'hui + 5 ans)
- Format de l'URL de l'image (doit commencer par http)
- Genre doit être une chaîne de caractères

## Tests d'intégration (`tests/integration/api.test.js`)

Vérifient les routes API avec de vraies requêtes HTTP via supertest.

- `GET /api` → retourne le message de bienvenue
- `GET /api/films` → retourne la liste des films
- `POST /api/films` → crée un nouveau film
- `GET /api/films/:id` → retourne un film par son ID
- `GET /api/films/:id` avec un ID inexistant → retourne 404
- `PUT /api/films/:id` → modifie un film existant
- `PUT /api/films/:id` avec un ID inexistant → retourne 404
- `DELETE /api/films/:id` → supprime un film existant
- `DELETE /api/films/:id` avec un ID inexistant → retourne 404

## Outils

- **Jest** : framework de test
- **Supertest** : test des routes HTTP
