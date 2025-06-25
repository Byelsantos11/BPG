const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Listar todos clientes
router.get('/', (req, res) => {
  Customer.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Buscar cliente por id (opcional)
router.get('/:id', (req, res) => {
  Customer.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(results[0]);
  });
});

// Criar cliente
router.post('/', (req, res) => {
  const data = req.body;
  if (!data.name || !data.email || !data.phone) {
    return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios' });
  }
  Customer.create(data, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Cliente criado com sucesso', id: results.insertId });
  });
});

// Atualizar cliente
router.put('/:id', (req, res) => {
  const data = req.body;
  const id = req.params.id;
  if (!data.name || !data.email || !data.phone) {
    return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios' });
  }
  Customer.update(id, data, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ message: 'Cliente atualizado com sucesso' });
  });
});

// Deletar cliente
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Customer.delete(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ message: 'Cliente deletado com sucesso' });
  });
});

module.exports = router;
