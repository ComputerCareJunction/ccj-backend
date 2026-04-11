"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', auth_1.authMiddleware.authenticate, authController.getProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map