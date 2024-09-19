import { Router } from 'express';
const router = Router();
import { registerUser, loginUser, getMyProfile } from '../controllers/userControllers';
import { protect } from '../middleware/authMiddleware';

// route: /api/user/
router.route('/register-user').post(registerUser);
router.route('/login-user').post(loginUser);
router.route('/get-user').get(protect, getMyProfile);

export default router;
