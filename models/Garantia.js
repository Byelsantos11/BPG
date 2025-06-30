const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Produto = require("./Produto");
const User = require("./User");

const Garantia = sequelize.define("Garantia", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "clientes", key: "id" }
  },
  produto_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: "produtos", key: "id" }
  },
  pacote_garantia: {
    type: DataTypes.ENUM("Premium", "Prata", "Bronze"),
    allowNull: false
  },
  status_garantia: {
    type: DataTypes.ENUM("Vencida", "Estendida", "Cancelada"),
    defaultValue: "Estendida"
  },
  data_inicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data_expiracao: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: "garantias",
  timestamps: false
});

module.exports = Garantia;
