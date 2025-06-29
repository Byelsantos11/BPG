const Cliente = require("./Cliente");
const Service = require("./Services");
const Produto = require("./Produto");
const Garantia = require("./Garantia");
const User = require("./User");

// Associações de Serviço com Cliente
Cliente.hasMany(Service, { foreignKey: "user_id", as: "servicos" });
Service.belongsTo(Cliente, { foreignKey: "user_id", as: "cliente" });

// Associações de Garantia com Produto e User
Produto.hasMany(Garantia, { foreignKey: "produto_id" });
Garantia.belongsTo(Produto, { foreignKey: "produto_id" });

User.hasMany(Garantia, { foreignKey: "user_id" });
Garantia.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  Cliente,
  Service,
  Produto,
  Garantia,
  User
};
