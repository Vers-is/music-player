const express = require("express");
const userController = require("../controllers/userController");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Настройка Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/avatars"),
    filename: (req, file, cb) => cb(null, `${req.session.username}-${Date.now()}.jpg`), // Используем username из сессии
});
const upload = multer({ storage });

// Роуты
router.get("/:username", userController.getUserData);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/updateAvatar", authMiddleware, upload.single("avatar"), userController.updateAvatar);
router.get("/current", authMiddleware, userController.getUserData); 

// Проверка сессии
router.get("/session-test", (req, res) => {
    console.log("Current session:", req.session);
    res.json({ 
        sessionExists: !!req.session,
        userId: req.session.userId || null,
        username: req.session.username || null
    });
});

module.exports = router;