const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/UserModel');
const Token = require('../models/tokenModel');

class AuthService {
  async findUserByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async generateToken(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await Token.create({
      userId,
      token,
      expiresAt
    });
    
    return token;
  }

  async registerUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return await User.create({
      username: userData.username,
      password: hashedPassword,
      email: userData.email || `${userData.username}@example.com`,
      avatar: '/images/default.jpg',
      isAdmin: false
    });
  }

  async logout(token) {
    await Token.destroy({ where: { token } });
  }
}

module.exports = new AuthService();