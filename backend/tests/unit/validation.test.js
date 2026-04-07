const { validateFilm } = require("../../src/validation/filmValidation");

describe("Validation des films", () => {
  test("un film valide ne retourne aucune erreur", () => {
    const film = { titre: "Inception", genre: "Sci-Fi", annee: 2010, image_url: "https://example.com/img.jpg" };
    expect(validateFilm(film).errors).toEqual([]);
  });

  test("un film sans titre retourne une erreur", () => {
    const film = { titre: "", genre: "Action", annee: 2020 };
    const { errors } = validateFilm(film);
    expect(errors).toContain("Le titre est requis");
  });

  test("un film avec titre null retourne une erreur", () => {
    const film = { genre: "Action", annee: 2020 };
    const { errors } = validateFilm(film);
    expect(errors).toContain("Le titre est requis");
  });

  test("une année trop ancienne retourne une erreur", () => {
    const film = { titre: "Test", annee: 1800 };
    const { errors } = validateFilm(film);
    expect(errors.length).toBeGreaterThan(0);
  });

  test("une année sous forme de chaîne est normalisée", () => {
    const film = { titre: "Film Futur", annee: String(new Date().getFullYear() + 1) };
    const validation = validateFilm(film);
    expect(validation.errors).toEqual([]);
    expect(validation.value.annee).toBe(new Date().getFullYear() + 1);
  });

  test("une URL d'image invalide retourne une erreur", () => {
    const film = { titre: "Test", image_url: "pas-une-url" };
    const { errors } = validateFilm(film);
    expect(errors).toContain("L'URL de l'image doit commencer par http ou https");
  });

  test("une URL d'image valide est acceptée", () => {
    const film = { titre: "Test", image_url: "https://image.tmdb.org/poster.jpg" };
    expect(validateFilm(film).errors).toEqual([]);
  });

  test("un genre invalide retourne une erreur", () => {
    const film = { titre: "Test", genre: 42 };
    const { errors } = validateFilm(film);
    expect(errors).toContain("Le genre doit être une chaîne");
  });

  test("une description invalide retourne une erreur", () => {
    const film = { titre: "Test", description: 42 };
    const { errors } = validateFilm(film);
    expect(errors).toContain("La description doit être une chaîne");
  });

  test("une année invalide retourne une erreur", () => {
    const film = { titre: "Test", annee: "vingt vingt" };
    const { errors } = validateFilm(film);
    expect(errors).toContain("L'année doit être un entier");
  });
});
