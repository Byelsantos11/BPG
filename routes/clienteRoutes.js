const express = require("express");
const router = express.Router();
const { body, param, validationResult, query } = require("express-validator");
const authenticateToken = require("../Middleware/authenticateToken");
const Cliente = require("../models/Cliente");

// Middleware para validar erros do express-validator
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Criar cliente com validação
router.post(
  "/criarCliente",
  authenticateToken,
  [
    body("nome").isString().withMessage("Nome deve ser uma string").notEmpty().withMessage("Nome é obrigatório"),
    body("email").isEmail().withMessage("Email inválido"),
    body("telefone").optional().isString().withMessage("Telefone deve ser uma string"),
    // Adicione outras validações conforme seu modelo Cliente
  ],
  validate,
  async (req, res) => {
    try {
      const cliente = await Cliente.create(req.body);
      res.status(201).json({ message: "Cliente cadastrado com sucesso!", cliente });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Listar clientes com paginação (page e limit opcionais)
router.get(
  "/listaCliente",
  authenticateToken,
  [
    query("page").optional().isInt({ min: 1 }).withMessage("page deve ser inteiro positivo"),
    query("limit").optional().isInt({ min: 1 }).withMessage("limit deve ser inteiro positivo"),
  ],
  validate,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: clientes } = await Cliente.findAndCountAll({
        limit,
        offset,
        order: [["id", "ASC"]],
      });

      res.status(200).json({
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        clientes,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Excluir cliente com validação de id
router.delete(
  "/excluirCliente/:id",
  authenticateToken,
  [param("id").isInt().withMessage("ID inválido")],
  validate,
  async (req, res) => {
    try {
      const rowsDeleted = await Cliente.destroy({
        where: { id: req.params.id },
      });

      if (rowsDeleted === 0) {
        return res.status(404).json({ message: "Cliente não encontrado!" });
      }

      res.status(200).json({ message: "Cliente deletado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Editar cliente com validação de id e dados
router.put(
  "/editarCliente/:id",
  authenticateToken,
  [
    param("id").isInt().withMessage("ID inválido"),
    body("nome").optional().isString().withMessage("Nome deve ser uma string"),
    body("email").optional().isEmail().withMessage("Email inválido"),
    body("telefone").optional().isString().withMessage("Telefone deve ser uma string"),
    // Adicione outras validações conforme seu modelo Cliente
  ],
  validate,
  async (req, res) => {
    try {
      const [rowsUpdated] = await Cliente.update(req.body, {
        where: { id: req.params.id },
      });

      if (rowsUpdated === 0) {
        return res.status(404).json({ message: "Cliente não encontrado!" });
      }

      res.status(200).json({ message: "Cliente editado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Quantidade total de clientes
router.get("/quantidadeCliente", authenticateToken, async (req, res) => {
  try {
    const quantidade = await Cliente.count();
    res.status(200).json({ quantidade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
