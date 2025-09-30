// server/server.js
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import requirementsRoute from './routes/requirements.js';
import chatsRoutes from "./routes/chats.js";
import entitiesRoute from './routes/entities.js';

console.log("🔑 Gemini Key loaded:", process.env.GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => res.send('AI App Builder API'));

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI missing in .env');
  process.exit(1);
}

/**
 * @todo deprecation warning for useNewUrlParser and useUnifiedTopology
 * https://jira.mongodb.org/browse/NODE-2138
 * 
 */
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

mongoose.connection.on('connected', () => {
  console.log('🔌 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

/**
 *  API ROUTES
 */
app.use('/api/requirements', requirementsRoute);
app.use("/api/chat", chatsRoutes);
// app.use("/api/entities", entitiesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
