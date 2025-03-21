const fs = require('fs');
const path = require('path');

// Функция для логирования в файл
const logErrorToFile = (error) => {
  const logFile = path.join(__dirname, 'logs', 'error.log');
  const errorMessage = `[${new Date().toISOString()}] ${error.stack || error.message}\n`;
  
  // Если папка с логами не существует, создаем ее
  if (!fs.existsSync(path.dirname(logFile))) {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
  }

  fs.appendFileSync(logFile, errorMessage);
};

module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  // Логируем ошибку в файл
  logErrorToFile(err);

  // Обрабатываем ошибки
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Ошибка валидации',
      message: err.message,
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      error: 'Ошибка базы данных',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Обработка других ошибок
  res.status(500).json({
    error: 'Ошибка сервера',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
