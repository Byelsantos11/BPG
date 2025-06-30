const Cliente = require("./Cliente");
const Service = require("./Services");
const Produto = require("./Produto");
const Garantia = require("./Garantia");
const User = require("./User");

// Associações de Serviço com Cliente
Cliente.hasMany(Service, { foreignKey: "user_id", as: "servicos" });
Service.belongsTo(Cliente, { foreignKey: "user_id", as: "cliente" });


// Associação Cliente <-> Garantia
Cliente.hasMany(Garantia, { foreignKey: "user_id", as: "garantias" });
Garantia.belongsTo(Cliente, { foreignKey: "user_id", as: "cliente" });

// Associação Produto <-> Garantia
Produto.hasMany(Garantia, { foreignKey: "produto_id", as: "garantias" });
Garantia.belongsTo(Produto, { foreignKey: "produto_id", as: "produto" });

module.exports = {
  Cliente,
  Service,
  Produto,
  Garantia,
  User
};