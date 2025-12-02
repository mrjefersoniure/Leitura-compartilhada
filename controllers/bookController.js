const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

/* ──────────────────────────────────────────
   LISTAR TODOS OS LIVROS (TODOS ENXERGAM)
────────────────────────────────────────── */
exports.getAllBooks = async (req, res) => {
    const { q } = req.query;
    try {
        const books = await Book.findAll(q);
        res.json(books);
    } catch (error) {
        console.error("Erro ao buscar livros:", error);
        res.status(500).json({ error: 'Erro interno ao buscar livros.' });
    }
};

/* ──────────────────────────────────────────
   BUSCAR LIVRO POR ID
────────────────────────────────────────── */
exports.getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);
        
        if (!book) {
            return res.status(404).json({ error: 'Livro não encontrado.' });
        }
        
        res.json(book);
    } catch (error) {
        console.error("Erro ao buscar detalhes do livro:", error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};

/* ──────────────────────────────────────────
   CRIAR LIVRO
────────────────────────────────────────── */
exports.createBook = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    }
    const path_imagem = '/uploads/' + req.file.filename;

    // Agora funciona corretamente
    const email_criador = req.body.email_contato;

    const { titulo, email_contato } = req.body;

    if (!titulo || !email_contato) {
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: 'Título e E-mail de contato são obrigatórios.' });
    }

    try {
        const newBook = await Book.create(req.body, path_imagem, email_criador);
        res.status(201).json({ message: 'Livro cadastrado com sucesso!', ...newBook });
    } catch (error) {
        fs.unlink(req.file.path, () => {});
        console.error("Erro ao criar livro:", error);
        res.status(500).json({ error: 'Erro interno ao cadastrar o livro.' });
    }
};

/* ──────────────────────────────────────────
   ATUALIZAR LIVRO (apenas o criador pode)
────────────────────────────────────────── */
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    let novaImagePath = req.file ? '/uploads/' + req.file.filename : null;

    const email_usuario_logado = req.headers['x-user-email'];

    try {
        const livroAntigo = await Book.findById(id);
        if (!livroAntigo) {
            if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(404).json({ error: 'Livro não encontrado para edição.' });
        }

        // Segurança — apenas o criador pode editar
        if (livroAntigo.email_criador !== email_usuario_logado) {
            if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(403).json({ error: 'Acesso negado. Você não é o criador deste livro.' });
        }

        const result = await Book.update(id, data, novaImagePath);

        if (novaImagePath && livroAntigo.path_imagem) {
            const fullOldPath = path.join(process.cwd(), 'public', livroAntigo.path_imagem);
            fs.unlink(fullOldPath, () => {});
        }

        res.json({ message: 'Livro atualizado com sucesso.', changes: result.changes });
    } catch (error) {
        if (req.file) fs.unlink(req.file.path, () => {});
        console.error("Erro ao atualizar livro:", error);
        res.status(500).json({ error: 'Erro interno ao atualizar o livro.' });
    }
};

/* ──────────────────────────────────────────
   EXCLUIR LIVRO (apenas o criador pode)
────────────────────────────────────────── */
exports.deleteBook = async (req, res) => {
    const { id } = req.params;

    const email_usuario_logado = req.headers['x-user-email'];

    try {
        const livro = await Book.findById(id);
        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado.' });
        }

        // Segurança — apenas o criador pode apagar
        if (livro.email_criador !== email_usuario_logado) {
            return res.status(403).json({ error: 'Acesso negado. Você não é o criador deste livro.' });
        }

        const result = await Book.delete(id);

        if (result.changes > 0) {
            const fullPath = path.join(process.cwd(), 'public', livro.path_imagem);
            fs.unlink(fullPath, () => {});
            res.json({ message: 'Livro excluído com sucesso.' });
        } else {
            res.status(404).json({ error: 'Livro não encontrado para exclusão.' });
        }
    } catch (error) {
        console.error("Erro ao deletar livro:", error);
        res.status(500).json({ error: 'Erro interno ao excluir o livro.' });
    }
};
