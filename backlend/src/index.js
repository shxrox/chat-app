import express from 'express';
import dotenv from 'dotenv';
import autuhRoute from './routes/auth.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
  
app.use("/api/auth", autuhRoute);

app.listen(PORT, () => {
  console.log('Backend server is running on http://localhost:' + PORT);
  connectDB();
});