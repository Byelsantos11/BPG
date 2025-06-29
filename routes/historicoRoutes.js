const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const authenticateToken = require("../Middleware/authenticateToken");
const HistoricoAtendimento = require("../models/HistoricoAtendimento");

// Middleware para validar erros do express-validator
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Criar registro de histórico
router.post(
  "/criarHistorico",
  authenticateToken,
  [
    body("servico_id").isInt().withMessage("servico_id deve ser inteiro"),
    body("descricao").optional().isString(),
    body("status_atendimento")
      .optional()
      .isIn(["Pendente", "Em andamento", "Concluído", "Cancelado"])
      .withMessage("status_atendimento inválido"),
    body("tecnico").optional().isIn(["Michel", "Celso"]).withMessage("técnico inválido"),
    body("observacoes").optional().isString(),
  ],
  validate,
  async (req, res) => {
    try {
      const historico = await HistoricoAtendimento.create(req.body);
      res.status(201).json({ message: "Histórico criado com sucesso!", historico });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Listar históricos de um serviço
router.get(
  "/listarHistoricos/:servico_id",
  authenticateToken,
  [param("servico_id").isInt().withMessage("servico_id inválido")],
  validate,
  async (req, res) => {
    try {
      const historicos = await HistoricoAtendimento.findAll({
        where: { servico_id: req.params.servico_id },
        order: [["data_atendimento", "DESC"]],
      });
      res.status(200).json(historicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Editar histórico pelo ID
router.put(
  "/editarHistorico/:id",
  authenticateToken,
  [
    param("id").isInt().withMessage("ID inválido"),
    body("descricao").optional().isString(),
    body("status_atendimento")
      .optional()
      .isIn(["Pendente", "Em andamento", "Concluído", "Cancelado"]),
    body("tecnico").optional().isIn(["Michel", "Celso"]),
    body("observacoes").optional().isString(),
  ],
  validate,
  async (req, res) => {
    try {
      const [rowsUpdated] = await HistoricoAtendimento.update(req.body, {
        where: { id: req.params.id },
      });
      if (rowsUpdated === 0) return res.status(404).json({ message: "Histórico não encontrado!" });
      res.status(200).json({ message: "Histórico atualizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Deletar histórico
router.delete(
  "/excluirHistorico/:id",
  authenticateToken,
  [param("id").isInt().withMessage("ID inválido")],
  validate,
  async (req, res) => {
    try {
      const rowsDeleted = await HistoricoAtendimento.destroy({ where: { id: req.params.id } });
      if (rowsDeleted === 0) return res.status(404).json({ message: "Histórico não encontrado!" });
      res.status(200).json({ message: "Histórico deletado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
