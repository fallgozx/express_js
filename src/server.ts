import app from './app';
import env from './config/env';
import { connectRedis } from './config/redis';

const startServer = async () => {
  try {
    await connectRedis();
    console.log('Redis connected');

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
