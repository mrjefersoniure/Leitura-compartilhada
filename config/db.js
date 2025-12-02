const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./livros.db', (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err);
    } else {
        console.log("Banco SQLite conectado.");
    }
});

// Criar tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS livros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            autor TEXT,
            genero TEXT,
            descricao TEXT,
            email_contato TEXT NOT NULL,
            path_imagem TEXT,
            email_criador TEXT
        )
    `);

    console.log("Tabelas verificadas/criadas.");
});

module.exports = db;
