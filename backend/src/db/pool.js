const mysql = require("mysql2/promise");

function createDatabasePool(dbConfig) {
  return mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

async function verifyDatabaseConnection(pool) {
  const connection = await pool.getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

async function closeDatabasePool(pool) {
  if (!pool) {
    return;
  }

  await pool.end();
}

module.exports = {
  closeDatabasePool,
  createDatabasePool,
  verifyDatabaseConnection,
};
