const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

let hasLoadedEnvironment = false;
let cachedConfig = null;

function loadEnvironment() {
  if (hasLoadedEnvironment) {
    return;
  }

  const envFileName = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
  const envFilePath = path.resolve(__dirname, "..", "..", envFileName);

  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath, quiet: true });
  }

  hasLoadedEnvironment = true;
}

function toInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) ? parsedValue : fallback;
}

function getConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  loadEnvironment();

  cachedConfig = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: toInteger(process.env.PORT, 3000),
    corsOrigin: process.env.CORS_ORIGIN || "*",
    db: {
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "projet_fil_rouge",
      port: toInteger(process.env.DB_PORT, 3306),
    },
  };

  return cachedConfig;
}

module.exports = {
  getConfig,
};
