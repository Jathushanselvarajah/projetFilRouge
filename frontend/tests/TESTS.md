# Documentation des Tests Frontend

## Lancer les tests

```bash
npm test
``` 

# Tests unitaires (`tests/unit/validation.test.js`)

Les tests unitaires vérifient le fonctionnement de petites parties isolées de l'application.

## Tests des composants (`SeriesCard.test.js`)

Ces tests vérifient que le composant `SeriesCard` affiche correctement les informations d'un film.

**Ce qui est testé :**
- Le titre du film est bien affiché
- La description est visible
- Le genre et l'année sont affichés
- L'image est présente avec le bon attribut `alt`

**Pourquoi c'est important :**

Cela garantit que le composant fonctionne correctement indépendamment du reste de l'application.
Si un bug apparaît dans l'affichage d'un film, il sera rapidement détecté.


## Tests des services API (`api.test.js`)

Ces tests vérifient les fonctions qui communiquent avec le backend (`getAllFilms`, etc.).

**Ce qui est testé :**
- Les données sont correctement récupérées lorsque l'API répond
- Une erreur est levée si l'API échoue

**Pourquoi c'est important :**

On simule (**mock**) les appels API pour éviter de dépendre du backend réel.
Cela permet de tester rapidement et de manière fiable.


# Tests d'intégration

Les tests d'intégration vérifient que plusieurs parties de l'application fonctionnent correctement ensemble.

## Test de la page Home (`Home.test.js`)

Ce test vérifie le comportement global de la page principale.

**Ce qui est testé :**
- Le message `"Chargement..."` s'affiche au début
- Les films sont récupérés depuis l'API (mockée)
- Les films sont affichés dans la liste via `SeriesList` et `SeriesCard`

**Pourquoi c'est important :**

Cela permet de s'assurer que :
- Les composants sont bien connectés entre eux
- Les données circulent correctement dans l'application
