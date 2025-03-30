const authService = require('../services/authService');
const { validateLogin, validateRegister } = require('../validators/authValidator');

class AuthController {
  async login(req, res, next) {
    try {
      const { error } = validateLogin(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { username, password } = req.body;
      
      const user = await authService.findUserByUsername(username);
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      
      const isPasswordValid = await authService.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Неверный пароль' });
      }
      
      const token = await authService.generateToken(user.id);
      
      res.cookie('auth_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
      });
      
      res.json({ success: true, username: user.username });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { error } = validateRegister(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { username, password, email } = req.body;
      
      const existingUser = await authService.findUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
      }
      
      await authService.registerUser({ username, password, email });
      
      res.status(201).json({ message: 'Регистрация успешна!' });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.cookies.auth_token;
      if (token) {
        await authService.logout(token);
        res.clearCookie('auth_token');
      }
      
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();