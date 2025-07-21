import { Router } from "express";
import { verifyToken } from "../middlewares/authmiddlewares";
import { fetchAllMessagesByConversationId } from "../controller/messageController";



const router = Router();
router.get('/:conversationId', verifyToken, fetchAllMessagesByConversationId);

export default router;