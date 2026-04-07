const { getConfig } = require("../src/config/env");
const { closeDatabasePool, createDatabasePool } = require("../src/db/pool");

const films = [
  {
    titre: "Inception",
    genre: "Science-Fiction",
    annee: 2010,
    description: "Un voleur qui pénètre dans les rêves des gens pour voler leurs secrets.",
    image_url: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEhniJIGshtGc.jpg",
  },
  {
    titre: "The Dark Knight",
    genre: "Action",
    annee: 2008,
    description: "Batman affronte le Joker, un criminel qui sème le chaos à Gotham City.",
    image_url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1bgA27.jpg",
  },
  {
    titre: "Interstellar",
    genre: "Science-Fiction",
    annee: 2014,
    description: "Des explorateurs voyagent à travers un trou de ver pour sauver l'humanité.",
    image_url: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    titre: "Pulp Fiction",
    genre: "Thriller",
    annee: 1994,
    description: "Les vies de deux tueurs à gages, d'un boxeur et d'un couple de braqueurs s'entrelacent.",
    image_url: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
  },
  {
    titre: "Parasite",
    genre: "Thriller",
    annee: 2019,
    description: "Une famille pauvre s'infiltre dans la vie d'une famille riche.",
    image_url: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
];

const query = "INSERT INTO films (titre, genre, annee, description, image_url) VALUES (?, ?, ?, ?, ?)";

async function seed() {
  const config = getConfig();
  const pool = createDatabasePool(config.db);

  try {
    for (const film of films) {
      await pool.query(query, [film.titre, film.genre, film.annee, film.description, film.image_url]);
      console.log(`Film "${film.titre}" ajouté !`);
    }
  } catch (error) {
    console.error("Erreur seed :", error);
    process.exitCode = 1;
  } finally {
    await closeDatabasePool(pool);
  }
}

seed();
