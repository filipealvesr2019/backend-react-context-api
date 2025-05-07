const { default: mongoose } = require("mongoose");

const carrinhoSchema = new mongoose.Schema({
    produtoId: mongoose.Schema.Types.ObjectId,
    nome: String, 
    preco: Number,
    quantidade: Number

});

module.exports = mongoose.model("Carrinho", carrinhoSchema)