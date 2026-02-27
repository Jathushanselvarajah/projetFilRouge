const request = require("supertest");
const { app, pool } = require("../../server");

let createdFilmId;

describe("API Films - Tests d'intégration", () => {

  describe("GET /api", () => {
    test("retourne un message de bienvenue", async () => {
      const res = await request(app).get("/api");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("API Projet Fil Rouge opérationnelle !");
    });
  });

  describe("GET /api/films", () => {
    test("retourne un tableau de films", async () => {
      const res = await request(app).get("/api/films");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test("chaque film a les propriétés attendues", async () => {
      const res = await request(app).get("/api/films");
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
      const res = await request(app).post("/api/films").send(newFilm);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Film ajouté");
      expect(res.body).toHaveProperty("id");
      createdFilmId = res.body.id;
    });
  });

  describe("GET /api/films/:id", () => {
    test("retourne le film créé", async () => {
      const res = await request(app).get(`/api/films/${createdFilmId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.titre).toBe("Film Test Jest");
      expect(res.body.genre).toBe("Test");
    });

    test("retourne 404 pour un film inexistant", async () => {
      const res = await request(app).get("/api/films/99999");
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
      const res = await request(app).put(`/api/films/${createdFilmId}`).send(updatedFilm);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Film modifié");
    });

    test("retourne 404 pour un film inexistant", async () => {
      const res = await request(app).put("/api/films/99999").send({ titre: "X" });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/films/:id", () => {
    test("supprime le film de test", async () => {
      const res = await request(app).delete(`/api/films/${createdFilmId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Film supprimé");
    });

    test("retourne 404 si le film est déjà supprimé", async () => {
      const res = await request(app).delete(`/api/films/${createdFilmId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  afterAll((done) => {
    pool.end(done);
  });
});
