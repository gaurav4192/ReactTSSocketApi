"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
router.post('/login', authController_1.login);
// router.post('/users', verifyUser, login);
router.post('/users', authController_1.login);
exports.default = router;
