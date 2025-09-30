// server/routes/chats.js
import express from "express";
import { handleChat } from "../controllers/chatsController.js";

const router = express.Router();

// POST /api/chat
router.post("/", handleChat);

export default router;
