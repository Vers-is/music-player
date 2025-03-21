const { Router } = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

const router = Router();

// Protected routes
router.get("/profile", authMiddleware, userController.getUserProfile);
router.post(
    "/avatar", 
    authMiddleware, 
    uploadMiddleware.single("avatar"), 
    userController.updateAvatar
);

module.exports = router;