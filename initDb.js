const sequelize = require('./config/db.config'); 
const User = require("./models/UserModel");
const Token = require('./models/tokenModel');
const Track = require('./models/musicModel');

async function initializeDatabase() {
  try {
    // Force: true will drop tables if they exist
    // Set to false in production
    await sequelize.sync({ force: true }); // Удаляет старую таблицу и создает новую
    console.log('Database & tables created!');

    try {
      // You can seed some initial data if needed
      await User.create({
        username: 'admin',
        password: '$2b$10$XuEuCoKbXUXvLYe/DQUkT.P8CjsOoff0BRsLJSeQgO/CcdMFaKzXO', // hashed 'admin123'
        email: 'admin@example.com',
        avatar: '/uploads/default-avatar.png', // Исправлено: avatarUrl -> avatar
        isAdmin: true,
      });
      console.log('Initial data seeded!');
    } catch (userError) {
      console.error('Detailed user creation error:', userError);
      console.error('Stack trace:', userError.stack);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 