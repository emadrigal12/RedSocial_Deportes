import express from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/google', authController.googleAuth);
router.get('/profile', verifyToken, authController.getProfile);

export default router;