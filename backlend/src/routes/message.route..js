import express from 'express';
import { protectRouter } from '../middleware/auth.middleware.js';
import { getUsersForSidebar , getMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/user',protectRouter, getUsersForSidebar)

router.get('/:id',protectRouter, getMessages);

export default router;