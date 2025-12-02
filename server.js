const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa o DB e as tabelas
require('./config/db');

// Middlewares
app.use(cors()); // Permite acesso externo
app.use(express.json());
app.use(express.static('public')); 

// Importa os roteadores
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

// Conecta as rotas
app.use('/api/auth', authRoutes);
app.use('/api/livros', bookRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send("API do projeto Leitura Compartilhada está funcionando 🚀");
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
