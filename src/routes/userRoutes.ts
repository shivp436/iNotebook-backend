import { Router } from 'express';
const router = Router();
import { registerUser, loginUser } from '../controllers/userControllers';

// route: /api/user/
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

export default router; 