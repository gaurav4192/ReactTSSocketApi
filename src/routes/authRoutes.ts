import { Router } from "express";
import {login, verifyUser} from '../controller/authController';

const router = Router();
router.post('/login', login);
// router.post('/users', verifyUser, login);
router.post('/users', login)
export default router;