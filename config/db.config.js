require('dotenv').config(); // Подключаем dotenv
console.log('Connecting to database:', process.env.DB_NAME);
console.log(`DB CONFIG: ${process.env.DB_NAME} ${process.env.DB_USER} ${process.env.DB_HOST} ${process.env.DB_PORT}`);


const { Sequelize } = require('sequelize'); // <-- Импортируем Sequelize

console.log('DB CONFIG:', process.env.DB_NAME, process.env.DB_USER, process.env.DB_HOST, process.env.DB_PORT);


const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false, 
    }
);

module.exports = sequelize;
