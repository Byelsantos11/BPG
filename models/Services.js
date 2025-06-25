const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Cliente = require("./Cliente"); // importa o model Cliente corretamente




const Service = sequelize.define("servicos", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  dispositivo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  numero_serie: {
    type: DataTypes.STRING(25),
    allowNull: false
  },

  tecnico: {
    type: DataTypes.ENUM("Michel", "Celso"),
    allowNull: true
  },

  status_servico: {
    type: DataTypes.ENUM(
      "Pendente",
      "Em diagnóstico",
      "Aguardando peças",
      "Em andamento",
      "Concluído",
      "Cancelado"
    ),
    defaultValue: "Pendente",
  },

  prioridade: {
    type: DataTypes.ENUM("Baixa", "Média", "Alta")
  },

  previsao_conclusao: {
    type: DataTypes.DATE,
    allowNull: true
  },

  descricao_problema: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  observacao_tecnica: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  tableName: "servicos",
  timestamps: false
});







module.exports = Service;
