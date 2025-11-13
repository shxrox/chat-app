import express from 'express';
import { protectRouter } from '../middleware/auth.middleware.js';
import { getUsersForSidebar , getMessages , sendMessage} from '../controllers/message.controller.js';

const router = express.Router();

router.get('/user',protectRouter, getUsersForSidebar)

router.get('/:id',protectRouter, getMessages);

router.post('/send/:id',protectRouter, sendMessage);

export default router;