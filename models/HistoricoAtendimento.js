const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Service = require("./Services");

const HistoricoAtendimento = sequelize.define(
  "historico_atendimentos",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    servico_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    data_atendimento: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_atendimento: {
      type: DataTypes.ENUM("Pendente", "Em andamento", "Concluído", "Cancelado"),
      defaultValue: "Pendente",
    },
    tecnico: {
      type: DataTypes.ENUM("Michel", "Celso"),
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "historico_atendimentos",
    timestamps: false,
  }
);

// Associação com Services
HistoricoAtendimento.belongsTo(Service, { foreignKey: "servico_id", as: "servico" });
Service.hasMany(HistoricoAtendimento, { foreignKey: "servico_id", as: "historicos" });

module.exports = HistoricoAtendimento;
