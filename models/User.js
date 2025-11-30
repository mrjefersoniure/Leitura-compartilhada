const db = require('../config/db');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

class User {
    static create(username, email, password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) return reject(err);

                const sql = `INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)`;
                db.run(sql, [username, email, hash], function(dbErr) {
                    if (dbErr) {
                        if (dbErr.errno === 19) {
                            return reject({ code: 409, message: 'Nome de usuário ou email já em uso.' });
                        }
                        return reject(dbErr);
                    }
                    resolve({ id: this.lastID, username, email });
                });
            });
        });
    }

    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM usuarios WHERE email = ?";
            db.get(sql, [email], (err, user) => {
                if (err) {
                    console.error("Erro no DB ao buscar usuário:", err);
                    return reject(err);
                }
                // Resolve, User será o objeto OU null/undefined.
                resolve(user); 
            });
        });
    }

    static comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
}

module.exports = User;