const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erreur connexion MySQL :", err);
  } else {
    console.log("Connecté à MySQL !");
    connection.release();
  }
});

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API Projet Fil Rouge opérationnelle !" });
});

router.get("/films", (req, res) => {
  pool.query("SELECT * FROM films ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.get("/films/:id", (req, res) => {
  pool.query("SELECT * FROM films WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "Film non trouvé" });
    res.json(results[0]);
  });
});

router.post("/films", (req, res) => {
  const { titre, genre, annee, description, image_url } = req.body;
  pool.query(
    "INSERT INTO films (titre, genre, annee, description, image_url) VALUES (?, ?, ?, ?, ?)",
    [titre, genre, annee, description, image_url],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Film ajouté", id: result.insertId });
    }
  );
});

router.put("/films/:id", (req, res) => {
  const { titre, genre, annee, description, image_url } = req.body;
  pool.query(
    "UPDATE films SET titre = ?, genre = ?, annee = ?, description = ?, image_url = ? WHERE id = ?",
    [titre, genre, annee, description, image_url, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Film non trouvé" });
      res.json({ message: "Film modifié" });
    }
  );
});

router.delete("/films/:id", (req, res) => {
  pool.query("DELETE FROM films WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Film non trouvé" });
    res.json({ message: "Film supprimé" });
  });
});

app.use("/api", router);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

module.exports = { app, pool };
