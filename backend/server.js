const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Route de base
app.get("/api", (req, res) => {
  res.json({ message: "API Projet Fil Rouge opérationnelle !" });
});

// TODO: Ajouter vos routes ici
// const clientsRouter = require("./routes/clients");
// app.use("/api/clients", clientsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
