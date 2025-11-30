const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./livros.db', (err) => {
    if (err) {
        console.error("Erro ao conectar ao DB:", err.message);
        process.exit(1);
    } else {
        console.log('Conectado ao banco de dados SQLite (livros.db).');
        initializeTables();
    }
});

function initializeTables() {
    // Tabela de Livros
    db.run(`CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT,
        genero TEXT,          
        descricao TEXT,       
        email_contato TEXT NOT NULL,
        path_imagem TEXT,
        email_criador TEXT    
    )`);

    // Tabela de Usuários
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    )`);

    console.log('Tabelas verificadas/criadas com sucesso.');
}

module.exports = db;