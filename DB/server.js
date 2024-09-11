const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const User = require('./User');  // Modelo de usuário
const { Op } = require('sequelize');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do multer para o upload de arquivos
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}${ext}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Somente arquivos .jpg, .jpeg e .png são permitidos'));
        }
        cb(null, true);
    }
});

// Middleware para servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static('uploads'));

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

// Na função de atualização de foto
app.post('/profile/avatar', upload.single('avatar'), async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    jwt.verify(token, 'secretkey', async (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token inválido" });

        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        // Se uma foto antiga existir, exclua-a
        if (user.avatar) {
            const oldPath = path.join('uploads', user.avatar);
            fs.unlink(oldPath, (err) => {
                if (err) {
                    console.error('Erro ao excluir foto antiga:', err);
                    return res.status(500).json({ error: 'Erro ao excluir foto antiga' });
                }
                console.log('Foto antiga excluída:', oldPath);
            });
        }

        // Verifique se o arquivo foi enviado
        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado" });
        }

        console.log('Arquivo recebido:', req.file);

        // Atualize o caminho da nova foto no banco de dados
        user.avatar = req.file.filename;
        await user.save();

        res.json({ avatar: `/uploads/${user.avatar}` });
    });
});

// Rota para remover a foto de perfil
app.post('/profile/remove-avatar', async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    jwt.verify(token, 'secretkey', async (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token inválido" });

        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        // Se uma foto existir, exclua-a
        if (user.avatar) {
            fs.unlink(path.join('uploads', user.avatar), (err) => {
                if (err) console.error('Erro ao excluir foto:', err);
            });

            // Limpe o campo da foto no banco de dados
            user.avatar = null;
            await user.save();
        }

        res.json({ message: "Foto de perfil removida com sucesso" });
    });
});

// Inicializa a tabela de usuários
app.listen(4000, () => {
    console.log('Servidor rodando na porta 4000');
});
