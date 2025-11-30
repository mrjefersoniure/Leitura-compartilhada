const db = require('../config/db');

class Book {
    static create(data, path_imagem, email_criador) {
        return new Promise((resolve, reject) => {
            const { titulo, autor, genero, descricao, email_contato } = data;
            
            const sql = `INSERT INTO livros (titulo, autor, genero, descricao, email_contato, path_imagem, email_criador) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const params = [titulo, autor, genero, descricao, email_contato, path_imagem, email_criador];

            db.run(sql, params, function(err) {
                if (err) return reject(err);
                resolve({ id: this.lastID, ...data, path_imagem, email_criador });
            });
        });
    }

    static findAll(query) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM livros";
            let params = [];

            if (query) {
                sql += " WHERE titulo LIKE ? OR autor LIKE ? OR genero LIKE ?";
                const termo = `%${query}%`;
                params = [termo, termo, termo];
            }
            sql += " ORDER BY titulo ASC";

            db.all(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
    
    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM livros WHERE id = ?";
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    static update(id, data, path_imagem) {
        return new Promise((resolve, reject) => {
            let fields = [];
            let params = [];
            
            for (const key in data) {
                if (data[key] !== undefined) { 
                    fields.push(`${key} = ?`);
                    params.push(data[key]);
                }
            }
            
            if (path_imagem) {
                fields.push("path_imagem = ?");
                params.push(path_imagem);
            }

            if (fields.length === 0) {
                return resolve({ changes: 0 }); 
            }

            params.push(id); 
            
            const sql = `UPDATE livros SET ${fields.join(", ")} WHERE id = ?`;
            
            db.run(sql, params, function(err) {
                if (err) return reject(err);
                resolve({ changes: this.changes });
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM livros WHERE id = ?";
            db.run(sql, [id], function(err) {
                if (err) return reject(err);
                resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = Book;