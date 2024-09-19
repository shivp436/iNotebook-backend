import { Router, Response, Request } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Get Notes route');
});

router.post('/', (req: Request, res: Response) => {
  res.send('Post Notes route');
});
