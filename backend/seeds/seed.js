const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

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

let count = 0;
films.forEach((film) => {
  pool.query(query, [film.titre, film.genre, film.annee, film.description, film.image_url], (err) => {
    if (err) {
      console.error(`Erreur ajout "${film.titre}" :`, err.message);
    } else {
      console.log(`Film "${film.titre}" ajouté !`);
    }
    count++;
    if (count === films.length) process.exit();
  });
});
