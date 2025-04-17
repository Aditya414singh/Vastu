import express from "express";
import { login, logout, register } from "../Controllers/auth.controller.js";
import { deleteUser, getUser, getUsers, savePost, updateUser,  getNotificationNumber } from "../Controllers/user.controller.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const router = express.Router();

// Open routes (without authentication)
router.get("/notification", verifyToken, getNotificationNumber);
router.get("/", getUsers);

// Protected routes (with authentication)
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save",verifyToken, savePost);


export default router;