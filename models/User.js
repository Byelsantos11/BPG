
  // models/User.js
  const { Sequelize, DataTypes } = require("sequelize");
  const sequelize = require("../config/db");



  //Tabela usuario em JSON
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
  }, {
    tableName: "usuarios",  // Especificando o nome da tabela
    timestamps: true,
  });


  //Exportação Livre
  module.exports = User;
