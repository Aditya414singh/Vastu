import express from "express";
import { login, logout, register } from "../Controllers/auth.controller.js";
import { addMessage } from "../Controllers/message.controller.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const router = express.Router();

// Open routes (without authentication)
// router.get("/", getUse);

// Protected routes (with authentication)
router.post("/:chatId", verifyToken, addMessage);


export default router;