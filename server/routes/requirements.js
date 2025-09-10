// server/routes/requirements.js
import express from 'express';
import { extractRequirements, listRequirements } from '../controllers/requirementsController.js';

const router = express.Router();

// POST /api/requirements
router.post('/', extractRequirements);

// GET /api/requirements
router.get('/', listRequirements);

export default router;
