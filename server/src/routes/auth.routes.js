import express from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/google', authController.googleAuth);
router.get('/profile', verifyToken, authController.getProfile);
router.get('/check-user', verifyToken, authController.checkUser);
router.post('/complete-registro', authController.completeRegistro);

export default router;