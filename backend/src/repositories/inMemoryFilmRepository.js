function normalizeFilmForStore(film, index) {
  return {
    id: film.id ?? index + 1,
    titre: film.titre,
    genre: film.genre ?? null,
    annee: film.annee ?? null,
    description: film.description ?? null,
    image_url: film.image_url ?? null,
    created_at: film.created_at || new Date(Date.now() - index * 1000).toISOString(),
  };
}

function createInMemoryFilmRepository(initialFilms = []) {
  let films = [];
  let nextId = 1;

  const reset = (newFilms = []) => {
    films = newFilms.map(normalizeFilmForStore);
    nextId = films.reduce((maxId, film) => Math.max(maxId, film.id), 0) + 1;
  };

  reset(initialFilms);

  return {
    reset,

    async findAll() {
      return [...films].sort((leftFilm, rightFilm) => {
        return new Date(rightFilm.created_at) - new Date(leftFilm.created_at);
      });
    },

    async findById(id) {
      return films.find((film) => film.id === Number(id)) || null;
    },

    async create(film) {
      const storedFilm = normalizeFilmForStore(
        {
          ...film,
          id: nextId++,
          created_at: new Date().toISOString(),
        },
        0
      );

      films.push(storedFilm);

      return storedFilm.id;
    },

    async update(id, film) {
      const filmIndex = films.findIndex((storedFilm) => storedFilm.id === Number(id));

      if (filmIndex === -1) {
        return false;
      }

      films[filmIndex] = {
        ...films[filmIndex],
        ...film,
        id: films[filmIndex].id,
        created_at: films[filmIndex].created_at,
      };

      return true;
    },

    async remove(id) {
      const filmIndex = films.findIndex((storedFilm) => storedFilm.id === Number(id));

      if (filmIndex === -1) {
        return false;
      }

      films.splice(filmIndex, 1);

      return true;
    },
  };
}

module.exports = {
  createInMemoryFilmRepository,
};
