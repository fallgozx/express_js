import express, { type Application } from 'express';
import authRoutes from './modules/auth/routes/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import env from './config/env';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    environment: env.NODE_ENV,
  });
});

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

export default app;
