function createMySqlFilmRepository(pool) {
  return {
    async findAll() {
      const [rows] = await pool.query("SELECT * FROM films ORDER BY created_at DESC");
      return rows;
    },

    async findById(id) {
      const [rows] = await pool.query("SELECT * FROM films WHERE id = ?", [id]);
      return rows[0] || null;
    },

    async create(film) {
      const [result] = await pool.query(
        "INSERT INTO films (titre, genre, annee, description, image_url) VALUES (?, ?, ?, ?, ?)",
        [film.titre, film.genre, film.annee, film.description, film.image_url]
      );

      return result.insertId;
    },

    async update(id, film) {
      const [result] = await pool.query(
        "UPDATE films SET titre = ?, genre = ?, annee = ?, description = ?, image_url = ? WHERE id = ?",
        [film.titre, film.genre, film.annee, film.description, film.image_url, id]
      );

      return result.affectedRows > 0;
    },

    async remove(id) {
      const [result] = await pool.query("DELETE FROM films WHERE id = ?", [id]);
      return result.affectedRows > 0;
    },
  };
}

module.exports = {
  createMySqlFilmRepository,
};
