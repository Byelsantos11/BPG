const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Rota api cliente
const ClientesRoutes = require("./routes/clienteRoutes");
app.use('/api/clientes', ClientesRoutes);

// Rota api produto
const ProdutoRoutes = require("./routes/produtoRoutes");
app.use('/api/produtos', ProdutoRoutes);

// Rota api serviço
const ServiceRoutes = require("./routes/serviceRoutes");
app.use('/api/servicos', ServiceRoutes);

// Rota api garantias (nova)
const GarantiaRoutes = require("./routes/garantiaRoutes");
app.use('/api/garantias', GarantiaRoutes);

// Rota api histórico de atendimentos (nova)
const HistoricoRoutes = require("./routes/historicoRoutes");
app.use('/api/historico', HistoricoRoutes);

// Rotas públicas login
const authRequest = require("./routes/auth");
app.use('/auth', authRequest);
app.use('/login', authRequest);

// Rota raiz simples para teste
app.get('/', (req, res) => {
  res.send('API funcionando na porta 5000!');
});

// Define porta fixa
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
