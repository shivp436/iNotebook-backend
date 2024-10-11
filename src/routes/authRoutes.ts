import { Router, Request, Response } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
const router = Router();

router.post('/verify-token', async (req: Request, res: Response) => {
  try {
    const result = await verifyToken(req);
    if (result.user) {
      return res
        .status(200)
        .json({ success: true, userName: result.user.userName });
    }
    return res.status(200).json({ success: false });
  } catch (error) {
    return res.status(200).json({ success: false });
  }
});

export default router;
