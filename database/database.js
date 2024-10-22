const Sequelize = require('sequelize');

const connection = new Sequelize('db_guiadeperguntas','root','1234',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection