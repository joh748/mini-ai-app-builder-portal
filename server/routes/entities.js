/**
 * this route is not used
 */
import express from "express";
import { getEntityFields } from "../controllers/entitiesController.js";

const router = express.Router();

// POST /api/entities/fields
router.post("/fields", getEntityFields);

export default router;
