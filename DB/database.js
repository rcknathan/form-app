const { Sequelize } = require('sequelize');

// Conectar ao banco de dados SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite' // o arquivo do banco de dados será criado nesta pasta
});

module.exports = sequelize;