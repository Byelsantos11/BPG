const express = require("express");
const router = express.Router();
const { body, param, validationResult, query } = require("express-validator");
const authenticateToken = require("../Middleware/authenticateToken");
const Produto = require("../models/Produto");

// Middleware para validar erros do express-validator
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Criar produto com validação
router.post(
  "/criarProduto",
  authenticateToken,
  [
    body("nome").isString().withMessage("Nome deve ser uma string").notEmpty().withMessage("Nome é obrigatório"),
    body("preco").isFloat({ gt: 0 }).withMessage("Preço deve ser número maior que 0"),
    body("descricao").optional().isString().withMessage("Descrição deve ser string"),
    // Adicione outras validações conforme seu modelo Produto
  ],
  validate,
  async (req, res) => {
    try {
      const produto = await Produto.create(req.body);
      res.status(201).json({ message: "Produto cadastrado com sucesso!", produto });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Listar produtos com paginação (page e limit opcionais)
router.get(
  "/listaProduto",
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

      const { count, rows: produtos } = await Produto.findAndCountAll({
        limit,
        offset,
        order: [["id", "ASC"]],
      });

      res.status(200).json({
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        produtos,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Excluir produto com validação de id
router.delete(
  "/excluirProduto/:id",
  authenticateToken,
  [param("id").isInt().withMessage("ID inválido")],
  validate,
  async (req, res) => {
    try {
      const rowsDeleted = await Produto.destroy({
        where: { id: req.params.id },
      });

      if (rowsDeleted === 0) {
        return res.status(404).json({ message: "Produto não encontrado!" });
      }

      res.status(200).json({ message: "Produto deletado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Editar produto com validação de id e dados
router.put(
  "/editarProduto/:id",
  authenticateToken,
  [
    param("id").isInt().withMessage("ID inválido"),
    body("nome").optional().isString().withMessage("Nome deve ser uma string"),
    body("preco").optional().isFloat({ gt: 0 }).withMessage("Preço deve ser número maior que 0"),
    body("descricao").optional().isString().withMessage("Descrição deve ser string"),
    // Adicione outras validações conforme seu modelo Produto
  ],
  validate,
  async (req, res) => {
    try {
      const [rowsUpdated] = await Produto.update(req.body, {
        where: { id: req.params.id },
      });

      if (rowsUpdated === 0) {
        return res.status(404).json({ message: "Produto não encontrado!" });
      }

      res.status(200).json({ message: "Produto editado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Quantidade total de produtos
router.get("/quantidadeProduto", authenticateToken, async (req, res) => {
  try {
    const quantidade = await Produto.count();
    res.status(200).json({ quantidade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
