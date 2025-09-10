// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import requirementsRoute from './routes/requirements.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => res.send('AI App Builder API'));

// API routes
app.use('/api/requirements', requirementsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
