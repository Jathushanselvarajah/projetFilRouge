const { getConfig } = require("../src/config/env");
const { closeDatabasePool, createDatabasePool } = require("../src/db/pool");

const createTable = `
CREATE TABLE IF NOT EXISTS films (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  annee INT,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

async function migrate() {
  const config = getConfig();
  const pool = createDatabasePool(config.db);

  try {
    await pool.query(createTable);
    console.log("Table 'films' créée avec succès !");
  } catch (error) {
    console.error("Erreur migration :", error);
    process.exitCode = 1;
  } finally {
    await closeDatabasePool(pool);
  }
}

migrate();
