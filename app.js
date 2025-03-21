const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./config/db.config');
const errorHandler = require('./middlewares/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://127.0.0.1:5502',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Important for cookies
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection error:', err));

// Sync models with database
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tables synchronized'))
  .catch(err => console.error('❌ Error syncing tables:', err));

// Routes
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;