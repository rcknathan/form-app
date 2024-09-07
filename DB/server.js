const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./User');  // Modelo de usuário
const { Op } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

// Rota de registro
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verifica se o email ou username já existem
        const existingUser = await User.findOne({ 
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });

        if (existingUser) {
            if (existingUser.username === username && existingUser.email === email) {
                return res.status(400).json({ error: "Username e email já estão em uso" });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ error: "Username já está em uso" });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ error: "Email já está em uso" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Erro ao registrar usuário" });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(403).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });

    res.json({ token });
});

// Rota de perfil
app.get('/profile', async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    jwt.verify(token, 'secretkey', async (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token inválido" });

        const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
        res.json(user);
    });
});

app.listen(4000, () => {
    console.log('Servidor rodando na porta 4000');
});
