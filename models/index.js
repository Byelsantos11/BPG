const Cliente = require("./Cliente");
const Service = require("./Services");

// Aqui sim faça as associações, para evitar problema de importação circular
Cliente.hasMany(Service, { foreignKey: "user_id", as: "servicos" });
Service.belongsTo(Cliente, { foreignKey: "user_id", as: "cliente" });

module.exports = {
  Cliente,
  Service
};
