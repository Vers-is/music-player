const User = require('../models/UserModel');
const Token = require('../models/tokenModel');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }
    
    const tokenRecord = await Token.findOne({ 
      where: { 
        token,
        expiresAt: { $gt: new Date() }
      }
    });
    
    if (!tokenRecord) {
      return res.status(401).json({ error: 'Недействительный или истекший токен' });
    }
    
    const user = await User.findByPk(tokenRecord.userId);
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};