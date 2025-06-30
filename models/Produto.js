const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cliente = sequelize.define("Produto", {

  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },

  categoria: {
    type: DataTypes.ENUM('Notebooks', 'Smartphones', 'TVs', 'Impressoras', 'Acessório'),
    allowNull: false,
  },

  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },

  modelo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  preco: {
   type:DataTypes.DOUBLE,
   allowNull: false

  },

  estoque: {
    type:DataTypes.BIGINT,
    allowNull: false

   },


  descricao: {
    type: DataTypes.STRING
  }

}, {
  tableName: 'produtos', // Especificando o nome da tabela
  timestamps: false
});

module.exports = Cliente;
