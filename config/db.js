const Database = require('better-sqlite3');

// Abre (ou cria) o banco
const db = new Database('./livros.db');

// Inicializa as tabelas
function initializeTables() {
    // Tabela de Livros
    db.prepare(`
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
    `).run();

    // Tabela de Usuários
    db.prepare(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    `).run();

    console.log("Tabelas verificadas/criadas com sucesso.");
}

// Inicializa ao carregar
initializeTables();

module.exports = db;
