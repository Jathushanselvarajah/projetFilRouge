const cors = require("cors");
const express = require("express");

const { validateFilm } = require("./validation/filmValidation");

function buildCorsOptions(corsOrigin) {
  if (!corsOrigin || corsOrigin === "*") {
    return { origin: "*" };
  }

  const allowedOrigins = corsOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origine non autorisée par CORS"));
    },
  };
}

function createApp({ filmRepository, corsOrigin = "*" }) {
  if (!filmRepository) {
    throw new Error("Le dépôt des films est requis");
  }

  const app = express();
  const router = express.Router();

  app.use(cors(buildCorsOptions(corsOrigin)));
  app.use(express.json());

  router.get("/", (req, res) => {
    res.json({ message: "API Projet Fil Rouge opérationnelle !" });
  });

  router.get("/films", async (req, res, next) => {
    try {
      const films = await filmRepository.findAll();
      res.json(films);
    } catch (error) {
      next(error);
    }
  });

  router.get("/films/:id", async (req, res, next) => {
    try {
      const film = await filmRepository.findById(req.params.id);

      if (!film) {
        res.status(404).json({ message: "Film non trouvé" });
        return;
      }

      res.json(film);
    } catch (error) {
      next(error);
    }
  });

  router.post("/films", async (req, res, next) => {
    try {
      const { errors, value } = validateFilm(req.body);

      if (errors.length > 0) {
        res.status(400).json({ message: "Données invalides", errors });
        return;
      }

      const filmId = await filmRepository.create(value);
      res.status(201).json({ message: "Film ajouté", id: filmId });
    } catch (error) {
      next(error);
    }
  });

  router.put("/films/:id", async (req, res, next) => {
    try {
      const existingFilm = await filmRepository.findById(req.params.id);

      if (!existingFilm) {
        res.status(404).json({ message: "Film non trouvé" });
        return;
      }

      const { errors, value } = validateFilm({ ...existingFilm, ...req.body });

      if (errors.length > 0) {
        res.status(400).json({ message: "Données invalides", errors });
        return;
      }

      await filmRepository.update(req.params.id, value);
      res.json({ message: "Film modifié" });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/films/:id", async (req, res, next) => {
    try {
      const hasDeletedFilm = await filmRepository.remove(req.params.id);

      if (!hasDeletedFilm) {
        res.status(404).json({ message: "Film non trouvé" });
        return;
      }

      res.json({ message: "Film supprimé" });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api", router);

  app.use((error, req, res, next) => {
    if (error.message === "Origine non autorisée par CORS") {
      res.status(403).json({ message: error.message });
      return;
    }

    console.error("Erreur API :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  });

  return app;
}

module.exports = {
  createApp,
};
