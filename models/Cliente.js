const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Service = require("./Services"); // importa o model de serviços

const Cliente = sequelize.define("Cliente", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  },

  endereco: {
    type: DataTypes.STRING,
    allowNull: false
  },

  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },

  estado: {
    type: DataTypes.STRING,
    allowNull: false
  },

  data_cadastro: {
    type: DataTypes.DATE
  }

}, {
  tableName: 'clientes',
  timestamps: false
});



module.exports = Cliente;
