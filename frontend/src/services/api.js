const API_URL = "http://localhost:3000/api";

export const getAllFilms = async () => {
  const response = await fetch(`${API_URL}/films`);
  if (!response.ok) throw new Error("Erreur lors de la récupération des films");
  return response.json();
};

export const getFilmById = async (id) => {
  const response = await fetch(`${API_URL}/films/${id}`);
  if (!response.ok) throw new Error("Film non trouvé");
  return response.json();
};

export const addFilm = async (film) => {
  const response = await fetch(`${API_URL}/films`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(film),
  });
  if (!response.ok) throw new Error("Erreur lors de l'ajout du film");
  return response.json();
};

export const updateFilm = async (id, film) => {
  const response = await fetch(`${API_URL}/films/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(film),
  });
  if (!response.ok) throw new Error("Erreur lors de la modification du film");
  return response.json();
};

export const deleteFilm = async (id) => {
  const response = await fetch(`${API_URL}/films/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erreur lors de la suppression du film");
  return response.json();
};