import { Router } from "express";
import { verifyToken } from "../middlewares/authmiddlewares";
import { fetchAllConversationsByUserId } from "../controller/conversationsController";


const router = Router();
console.log("test2");
router.get('/', verifyToken, fetchAllConversationsByUserId);

export default router;