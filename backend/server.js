const { createApp } = require("./src/app");
const { getConfig } = require("./src/config/env");
const { closeDatabasePool, createDatabasePool, verifyDatabaseConnection } = require("./src/db/pool");
const { createMySqlFilmRepository } = require("./src/repositories/mysqlFilmRepository");

async function startServer() {
  const config = getConfig();
  const pool = createDatabasePool(config.db);

  try {
    await verifyDatabaseConnection(pool);
    console.log("Connecté à MySQL !");

    const filmRepository = createMySqlFilmRepository(pool);
    const app = createApp({
      filmRepository,
      corsOrigin: config.corsOrigin,
    });

    const server = await new Promise((resolve) => {
      const startedServer = app.listen(config.port, () => {
        console.log(`Serveur démarré sur le port ${config.port}`);
        resolve(startedServer);
      });
    });

    const close = async () => {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      await closeDatabasePool(pool);
    };

    return {
      app,
      close,
      pool,
      server,
    };
  } catch (error) {
    await closeDatabasePool(pool).catch(() => {});
    throw error;
  }
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Impossible de démarrer le serveur :", error);
    process.exit(1);
  });
}

module.exports = {
  startServer,
};
