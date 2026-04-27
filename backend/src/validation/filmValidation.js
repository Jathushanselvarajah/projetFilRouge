function normalizeOptionalString(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  const normalizedValue = value.trim();
  return normalizedValue === "" ? null : normalizedValue;
}

function parseYear(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string" && /^\d{1,4}$/.test(value.trim())) {
    return Number.parseInt(value.trim(), 10);
  }

  return Number.NaN;
}

function isValidHttpUrl(value) {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function validateFilm(input = {}) {
  const errors = [];
  const currentYear = new Date().getFullYear();
  const titre = typeof input.titre === "string" ? input.titre.trim() : "";

  if (!titre) {
    errors.push("Le titre est requis");
  }

  const genre = normalizeOptionalString(input.genre);
  if (genre !== null && typeof genre !== "string") {
    errors.push("Le genre doit être une chaîne");
  }

  const description = normalizeOptionalString(input.description);
  if (description !== null && typeof description !== "string") {
    errors.push("La description doit être une chaîne");
  }

  const annee = parseYear(input.annee);
  if (Number.isNaN(annee)) {
    errors.push("L'année doit être un entier");
  } else if (annee !== null && (annee < 1888 || annee > currentYear + 5)) {
    errors.push(`L'année doit être comprise entre 1888 et ${currentYear + 5}`);
  }

  const imageUrl = normalizeOptionalString(input.image_url);
  if (imageUrl !== null && typeof imageUrl !== "string") {
    errors.push("L'URL de l'image doit être une chaîne");
  } else if (imageUrl !== null && !isValidHttpUrl(imageUrl)) {
    errors.push("L'URL de l'image doit commencer par http ou https");
  }

  return {
    errors,
    value: {
      titre,
      genre,
      annee,
      description,
      image_url: imageUrl,
    },
  };
}

module.exports = {
  validateFilm,
};
