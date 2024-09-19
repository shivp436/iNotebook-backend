import { Router, Request, Response } from 'express';
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Get Auth route');
});

router.post('/', (req: Request, res: Response) => {
  res.send('Post Auth route');
});
