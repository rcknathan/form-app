const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING, // Armazena a URL ou caminho da foto de perfil
        allowNull: true
    }
});

// Sincronizar com o banco de dados (criando a tabela)
sequelize.sync();

module.exports = User;
