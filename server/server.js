// server/server.js
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import requirementsRoute from './routes/requirements.js';
import chatsRoutes from "./routes/chats.js";
import entitiesRoute from './routes/entities.js';


const allowedOrigins = [
  "https://mini-ai-app-builder-portal.onrender.com",
  "http://localhost:3000"
];

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

/**
 *  API ROUTES
 */ 
app.get('/', (req, res) => res.send('AI App Builder API'));

app.use('/api/requirements', requirementsRoute);
app.use("/api/chat", chatsRoutes);
// app.use("/api/entities", entitiesRoute);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
