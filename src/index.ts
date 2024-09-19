import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// routes import
import userRoutes from './routes/userRoutes';
import noteRoutes from './routes/noteRoutes';

dotenv.config();
connectDB();

const app = express();
const port = Number(
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_PORT || 3000
    : process.env.PROD_PORT || 5000
);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// routes
app.use('/i-notebook/api/v1/note', noteRoutes);
app.use('/i-notebook/api/v1/user', userRoutes);
// app.use('/api/auth', require('./routes/authRoutes'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
