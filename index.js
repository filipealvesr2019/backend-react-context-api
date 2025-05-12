const express = require("express");
const app = express();

const mongoose = require("mongoose");
require("dotenv").config();

const cors = require('cors');

const cookieParser = require("cookie-parser");
const Produto = require("./models/Produto");
const Carrinho = require("./models/Carrinho");
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

// rota para exibir produtos
app.get("/Produtos", async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
})

// rota pra adicionar produto
app.post("/produtos", async (req, res) => {
  const { nome, preco } = req.body;
  const produto = new Produto({ nome, preco});
  await produto.save();
  res.status(201).json(produto)
})

// rota pra adicionar ao carrinho
app.post("/carrinho/adicionar/:id/:quantidade", async (req, res) => {
  const { id, quantidade } = req.params;
  const produto = await Produto.findById(id);
  if(!produto) return res.status(404).json({ erro: "Produto não encontrado"});

  const carrinhoItem = new Carrinho({
    produtoId: produto._id,
    nome: produto.nome,
    preco: produto.preco,
    quantidade
  });

  await carrinhoItem.save();

  const carrinho = await Carrinho.find();
  res.json({ sucesso: true, carrinho})
});

// rota pra remover produto do carrinho
app.post("/carrinho/remover/:id", async (req, res) => {
  const item = await Carrinho.findById(req.params.id);
  if(!item) return res.status(404).json({ erro: "Item não encontrado no carrinho"})
})

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
