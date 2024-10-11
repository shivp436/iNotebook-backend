import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import cors from 'cors';

// routes import
import userRoutes from './routes/userRoutes';
import noteRoutes from './routes/noteRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
connectDB();

const app = express();
const port = Number(
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_PORT || 3000
    : process.env.PROD_PORT || 5000
);

const corsOptions = {
  origin: 'http://localhost:8080', // allow requests from your React app
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // allow cookies to be sent
};

// Use CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// routes
app.use('/i-notebook/api/v1/note', noteRoutes);
app.use('/i-notebook/api/v1/user', userRoutes);
app.use('/i-notebook/api/v1/auth', authRoutes);
// app.use('/api/auth', require('./routes/authRoutes'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
