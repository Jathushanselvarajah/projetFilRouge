const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const createTable = `
CREATE TABLE IF NOT EXISTS films (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  annee INT,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

pool.query(createTable, (err) => {
  if (err) {
    console.error("Erreur migration :", err);
  } else {
    console.log("Table 'films' créée avec succès !");
  }
  process.exit();
});
