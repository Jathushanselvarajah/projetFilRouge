function validateFilm(film) {
  const errors = [];
  if (!film.titre || film.titre.trim() === "") errors.push("Le titre est requis");
  if (film.annee && (film.annee < 1888 || film.annee > new Date().getFullYear() + 5)) {
    errors.push("L'année doit être comprise entre 1888 et " + (new Date().getFullYear() + 5));
  }
  if (film.genre && typeof film.genre !== "string") errors.push("Le genre doit être une chaîne");
  if (film.image_url && !film.image_url.startsWith("http")) errors.push("L'URL de l'image doit commencer par http");
  return errors;
}

describe("Validation des films", () => {
  test("un film valide ne retourne aucune erreur", () => {
    const film = { titre: "Inception", genre: "Sci-Fi", annee: 2010, image_url: "https://example.com/img.jpg" };
    expect(validateFilm(film)).toEqual([]);
  });

  test("un film sans titre retourne une erreur", () => {
    const film = { titre: "", genre: "Action", annee: 2020 };
    const errors = validateFilm(film);
    expect(errors).toContain("Le titre est requis");
  });

  test("un film avec titre null retourne une erreur", () => {
    const film = { genre: "Action", annee: 2020 };
    const errors = validateFilm(film);
    expect(errors).toContain("Le titre est requis");
  });

  test("une année trop ancienne retourne une erreur", () => {
    const film = { titre: "Test", annee: 1800 };
    const errors = validateFilm(film);
    expect(errors.length).toBeGreaterThan(0);
  });

  test("une année future raisonnable est acceptée", () => {
    const film = { titre: "Film Futur", annee: new Date().getFullYear() + 1 };
    expect(validateFilm(film)).toEqual([]);
  });

  test("une URL d'image invalide retourne une erreur", () => {
    const film = { titre: "Test", image_url: "pas-une-url" };
    const errors = validateFilm(film);
    expect(errors).toContain("L'URL de l'image doit commencer par http");
  });

  test("une URL d'image valide est acceptée", () => {
    const film = { titre: "Test", image_url: "https://image.tmdb.org/poster.jpg" };
    expect(validateFilm(film)).toEqual([]);
  });
});
