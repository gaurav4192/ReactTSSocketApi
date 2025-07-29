import { Router } from "express";
import { verifyToken } from "../middlewares/authmiddlewares";
import { fetchAllConversationsByUserId } from "../controller/conversationsController";
import { addContact, fetchContacts } from "../controller/contactsController";


const router = Router();
console.log("test2");
router.get('/', verifyToken, fetchContacts);
router.post('/', verifyToken, addContact);

export default router;