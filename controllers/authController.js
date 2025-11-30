const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const newUser = await User.create(username, email, password);
        res.status(201).json({ 
            message: 'Usuário registrado com sucesso!', 
            user: { id: newUser.id, username, email } 
        });
    } catch (error) {
        if (error.code === 409) {
            return res.status(409).json({ error: error.message });
        }
        console.error("Erro no registro:", error);
        res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const match = await User.comparePassword(password, user.password_hash);

        if (match) {
            res.json({ 
                message: 'Login bem-sucedido!', 
                user: { id: user.id, username: user.username, email: user.email } 
            });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas.' });
        }
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: 'Erro interno ao tentar fazer login.' }); 
    }
};