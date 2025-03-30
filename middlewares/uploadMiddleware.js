const multer = require("multer");
const path = require("path");
const ApiError = require("../utils/errorHandler");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/avatars");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const extname = path.extname(file.originalname).toLowerCase();
    
    if (file.mimetype.startsWith("image/") && allowedExtensions.includes(extname)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Файл должен быть изображением с разрешением .jpg, .jpeg, .png или .gif"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 
    }
});

module.exports = upload;