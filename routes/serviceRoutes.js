const express = require("express");
const router = express.Router();
const { Service, Cliente } = require("../models"); 
const { body, param, validationResult } = require("express-validator");
const authenticateToken = require("../Middleware/authenticateToken");




// Middleware para validar erros do express-validator
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Criar serviço
router.post(
  "/criarServico",
  authenticateToken,
  [
    body("user_id").isInt().withMessage("user_id deve ser um inteiro"),
    body("dispositivo").isString().notEmpty().withMessage("dispositivo é obrigatório"),
    body("numero_serie").isString().notEmpty().withMessage("numero_serie é obrigatório"),
    body("tecnico").optional().isIn(["Michel", "Celso"]).withMessage("tecnico inválido"),
    body("status_servico")
      .optional()
      .isIn([
        "Pendente",
        "Em diagnóstico",
        "Aguardando peças",
        "Em andamento",
        "Concluído",
        "Cancelado",
      ])
      .withMessage("status_servico inválido"),
    body("prioridade").optional().isIn(["Baixa", "Média", "Alta"]).withMessage("prioridade inválida"),
    body("previsao_conclusao").optional().isISO8601().toDate().withMessage("previsao_conclusao inválida"),
    body("descricao_problema").optional().isString(),
    body("observacao_tecnica").optional().isString(),
  ],
  validate,
  async (req, res) => {
    try {
      const service = await Service.create(req.body);
      res.status(201).json({ message: "Serviço cadastrado com sucesso!", service });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);


//Lista de serviço
router.get("/listarServico", authenticateToken, async (req, res) => {
    try {
      const servicos = await Service.findAll({
        include: {
          model: Cliente,
          as: "cliente",
          attributes: ["nome"]
        }
      });
  
      res.status(200).json(servicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// Editar serviço
router.put(
  "/editarServico/:id",
  authenticateToken,
  [
    param("id").isInt().withMessage("ID inválido"),
    body("user_id").optional().isInt(),
    body("dispositivo").optional().isString(),
    body("numero_serie").optional().isString(),
    body("tecnico").optional().isIn(["Michel", "Celso"]),
    body("status_servico")
      .optional()
      .isIn([
        "Pendente",
        "Em diagnóstico",
        "Aguardando peças",
        "Em andamento",
        "Concluído",
        "Cancelado",
      ]),
    body("prioridade").optional().isIn(["Baixa", "Média", "Alta"]),
    body("previsao_conclusao").optional().isISO8601().toDate(),
    body("descricao_problema").optional().isString(),
    body("observacao_tecnica").optional().isString(),
  ],
  validate,
  async (req, res) => {
    try {
      const [rowsUpdated] = await Service.update(req.body, {
        where: { id: req.params.id },
      });

      if (rowsUpdated === 0) {
        return res.status(404).json({ message: "Serviço não encontrado!" });
      }

      res.status(200).json({ message: "Serviço atualizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Excluir serviço
router.delete(
  "/excluirServico/:id",
  authenticateToken,
  [param("id").isInt().withMessage("ID inválido")],
  validate,
  async (req, res) => {
    try {
      const rowsDeleted = await Service.destroy({
        where: { id: req.params.id },
      });

      if (rowsDeleted === 0) {
        return res.status(404).json({ message: "Serviço não encontrado!" });
      }

      res.status(200).json({ message: "Serviço deletado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Quantidade total de serviços que esta faltado pra ser finalizado

router.get("/quantidadeServico", authenticateToken, async (req, res) => {
  try {
    const quantidade = await Service.count({
        where:{
            status_servico: ["Pendente", "Em diagnóstico", "Aguardando peças", "Em andamento"]
        }
    });
    res.status(200).json({ quantidade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
