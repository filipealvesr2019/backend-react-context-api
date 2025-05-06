const { default: mongoose } = require("mongoose");

const produtoSchema = new mongoose.Schema({
    nome: String,
    preco: Number,
  });

  module.exports = mongoose.model( "Produto", produtoSchema)
  