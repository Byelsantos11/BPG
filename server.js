const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Rota api cliente
const ClientesRoutes = require ("./routes/clienteRoutes");
app.use('/api/clientes', ClientesRoutes);

// Rota api produto
const ProdutoRoutes = require ("./routes/produtoRoutes");
app.use('/api/produtos', ProdutoRoutes);

//rota api serviço
const ServiceRoutes = require("./routes/serviceRoutes");
app.use('/api/servicos', ServiceRoutes);


//Rotas públicas login
const authRequest = require("./routes/auth");
app.use('/auth', authRequest);
app.use('/login', authRequest);


// rota raiz simples para teste
app.get('/', (req, res) => {
  res.send('API funcionando na porta 5000!');
});

// define porta fixa
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
