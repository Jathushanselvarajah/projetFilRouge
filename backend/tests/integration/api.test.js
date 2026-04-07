const { createApp } = require("../../src/app");
const { createInMemoryFilmRepository } = require("../../src/repositories/inMemoryFilmRepository");
const { createTestClient } = require("../helpers/httpTestClient");

let api;
let createdFilmId;
let filmRepository;

const initialFilms = [
  {
    id: 1,
    titre: "Inception",
    genre: "Science-Fiction",
    annee: 2010,
    description: "Un voleur qui pénètre dans les rêves des gens pour voler leurs secrets.",
    image_url: "https://example.com/inception.jpg",
    created_at: "2026-01-01T10:00:00.000Z",
  },
  {
    id: 2,
    titre: "Interstellar",
    genre: "Science-Fiction",
    annee: 2014,
    description: "Des explorateurs voyagent à travers un trou de ver pour sauver l'humanité.",
    image_url: "https://example.com/interstellar.jpg",
    created_at: "2026-01-02T10:00:00.000Z",
  },
];

describe("API Films - Tests d'intégration", () => {
  beforeAll(() => {
    filmRepository = createInMemoryFilmRepository(initialFilms);

    const app = createApp({
      filmRepository,
      corsOrigin: "http://localhost:5173",
    });

    api = createTestClient(app);
  });

  beforeEach(() => {
    filmRepository.reset(initialFilms);
    createdFilmId = null;
  });

  describe("GET /api", () => {
    test("retourne un message de bienvenue", async () => {
      const res = await api.get("/api");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("API Projet Fil Rouge opérationnelle !");
    });
  });

  describe("GET /api/films", () => {
    test("retourne un tableau de films", async () => {
      const res = await api.get("/api/films");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test("chaque film a les propriétés attendues", async () => {
      const res = await api.get("/api/films");
      if (res.body.length > 0) {
        const film = res.body[0];
        expect(film).toHaveProperty("id");
        expect(film).toHaveProperty("titre");
        expect(film).toHaveProperty("genre");
        expect(film).toHaveProperty("annee");
      }
    });
  });

  describe("POST /api/films", () => {
    test("ajoute un film avec succès", async () => {
      const newFilm = {
        titre: "Film Test Jest",
        genre: "Test",
        annee: 2026,
        description: "Film créé par les tests automatisés",
        image_url: "https://example.com/test.jpg",
      };
      const res = await api.post("/api/films").send(newFilm);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Film ajouté");
      expect(res.body).toHaveProperty("id");
      createdFilmId = res.body.id;
    });

    test("retourne 400 si les données sont invalides", async () => {
      const res = await api.post("/api/films").send({ titre: "", image_url: "image-invalide" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Données invalides");
      expect(res.body.errors).toContain("Le titre est requis");
      expect(res.body.errors).toContain("L'URL de l'image doit commencer par http ou https");
    });
  });

  describe("GET /api/films/:id", () => {
    test("retourne le film créé", async () => {
      const createResponse = await api.post("/api/films").send({
        titre: "Film Test Jest",
        genre: "Test",
        annee: 2026,
        description: "Film créé par les tests automatisés",
        image_url: "https://example.com/test.jpg",
      });
      createdFilmId = createResponse.body.id;

      const res = await api.get(`/api/films/${createdFilmId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.titre).toBe("Film Test Jest");
      expect(res.body.genre).toBe("Test");
    });

    test("retourne 404 pour un film inexistant", async () => {
      const res = await api.get("/api/films/99999");
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Film non trouvé");
    });
  });

  describe("PUT /api/films/:id", () => {
    test("modifie un film avec succès", async () => {
      const updatedFilm = {
        titre: "Film Test Modifié",
        genre: "Test Modifié",
        annee: 2027,
        description: "Description modifiée",
        image_url: "https://example.com/updated.jpg",
      };
      const createResponse = await api.post("/api/films").send({
        titre: "Film Test Jest",
        genre: "Test",
        annee: 2026,
        description: "Film créé par les tests automatisés",
        image_url: "https://example.com/test.jpg",
      });
      createdFilmId = createResponse.body.id;

      const res = await api.put(`/api/films/${createdFilmId}`).send(updatedFilm);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Film modifié");
    });

    test("retourne 404 pour un film inexistant", async () => {
      const res = await api.put("/api/films/99999").send({ titre: "X" });
      expect(res.statusCode).toBe(404);
    });

    test("retourne 400 si la mise à jour est invalide", async () => {
      const res = await api.put("/api/films/1").send({ image_url: "pas-une-url" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Données invalides");
      expect(res.body.errors).toContain("L'URL de l'image doit commencer par http ou https");
    });
  });

  describe("DELETE /api/films/:id", () => {
    test("supprime le film de test", async () => {
      const createResponse = await api.post("/api/films").send({
        titre: "Film Test Jest",
        genre: "Test",
        annee: 2026,
        description: "Film créé par les tests automatisés",
        image_url: "https://example.com/test.jpg",
      });
      createdFilmId = createResponse.body.id;

      const res = await api.delete(`/api/films/${createdFilmId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Film supprimé");
    });

    test("retourne 404 si le film est déjà supprimé", async () => {
      const createResponse = await api.post("/api/films").send({
        titre: "Film Test Jest",
        genre: "Test",
        annee: 2026,
        description: "Film créé par les tests automatisés",
        image_url: "https://example.com/test.jpg",
      });
      createdFilmId = createResponse.body.id;

      await api.delete(`/api/films/${createdFilmId}`);
      const res = await api.delete(`/api/films/${createdFilmId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Film non trouvé");
    });
  });
});
