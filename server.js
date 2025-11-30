const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa o DB e as tabelas
require('./config/db'); 

// Importa os roteadores
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

// Middlewares
app.use(express.json());
app.use(express.static('public')); 

// Conexão das Rotas
app.use('/api/auth', authRoutes);
app.use('/api/livros', bookRoutes); 

// Inicia o Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});