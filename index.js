const express = require("express");
const app = express();

const mongoose = require("mongoose");
require("dotenv").config();

const cors = require('cors');

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors({
  origin: '*'
}));




// app.use(limiter);
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rota que lança um erro

app.get("/erro", (req, res) => {
  throw new Error("Erro simulado!");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Algo deu errado no banco de dados");
});

app.get("/", (req, res) => {
  res.send("Servidor Express.js esta rodando");
});


// Aplica CSRF globalmente, mas só para rotas não-API

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Erro: A variável de ambiente MONGODB_URI não está definida.");
  process.exit(1); // Encerra o processo, pois a conexão com o banco é crítica
}
const options = {
  serverSelectionTimeoutMS: 30000, // 30 segundos
  socketTimeoutMS: 30000, // 30 segundos
};
// Conexão com o banco de dados
mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch((error) => {
    console.error("Erro de conexão com o banco de dados:", error);
  });

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor esta rodando em http://localhost:${PORT}`);
});
