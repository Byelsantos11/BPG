const express = require("express");
const router = express.Router();
const { Garantia, Produto, User } = require("../models");
const { body, param, validationResult } = require("express-validator");
const authenticateToken = require("../Middleware/authenticateToken");

// Middleware de validação
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Criar Garantia
router.post(
  "/criarGarantia",
  authenticateToken,
  [
    body("user_id").isInt().withMessage("user_id inválido"),
    body("produto_id").isInt().withMessage("produto_id inválido"),
    body("pacote_garantia").isIn(["Premium", "Prata", "Bronze"]),
    body("status_garantia").optional().isIn(["Vencida", "Estendida", "Cancelada"]),
    body("data_inicio").isISO8601().withMessage("data_inicio inválida"),
    body("data_expiracao").isISO8601().withMessage("data_expiracao inválida")
  ],
  validate,
  async (req, res) => {
    try {
      const garantia = await Garantia.create(req.body);
      res.status(201).json({ message: "Garantia cadastrada com sucesso!", garantia });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Listar Garantias com info de produto e usuário
router.get("/listarGarantias", authenticateToken, async (req, res) => {
  try {
    const garantias = await Garantia.findAll({
      include: [
        { model: Produto, attributes: ["nome", "marca", "modelo"] },
        { model: User, attributes: ["username"] }
      ],
      order: [["id", "DESC"]]
    });
    res.status(200).json(garantias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar Garantia
router.put(
  "/editarGarantia/:id",
  authenticateToken,
  [
    param("id").isInt().withMessage("ID inválido"),
    body("pacote_garantia").optional().isIn(["Premium", "Prata", "Bronze"]),
    body("status_garantia").optional().isIn(["Vencida", "Estendida", "Cancelada"]),
    body("data_inicio").optional().isISO8601(),
    body("data_expiracao").optional().isISO8601()
  ],
  validate,
  async (req, res) => {
    try {
      const [rowsUpdated] = await Garantia.update(req.body, {
        where: { id: req.params.id }
      });

      if (rowsUpdated === 0) {
        return res.status(404).json({ message: "Garantia não encontrada!" });
      }

      res.status(200).json({ message: "Garantia atualizada com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Excluir Garantia
router.delete(
  "/excluirGarantia/:id",
  authenticateToken,
  [param("id").isInt().withMessage("ID inválido")],
  validate,
  async (req, res) => {
    try {
      const rowsDeleted = await Garantia.destroy({ where: { id: req.params.id } });

      if (rowsDeleted === 0) {
        return res.status(404).json({ message: "Garantia não encontrada!" });
      }

      res.status(200).json({ message: "Garantia excluída com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Quantidade de garantias ativas
router.get("/quantidadeGarantia", authenticateToken, async (req, res) => {
  try {
    const quantidade = await Garantia.count({
      where: { status_garantia: "Estendida" }
    });
    res.status(200).json({ quantidade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
