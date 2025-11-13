import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import autuhRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route..js';
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());
  
app.use("/api/auth", autuhRoute);
app.use("/api/message", messageRoute);


app.listen(PORT, () => {
  console.log('Backend server is running on http://localhost:' + PORT);
  connectDB();
});