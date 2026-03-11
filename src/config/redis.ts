import Redis from 'ioredis';
import env from './env';

let redis: Redis | null = null;

export const connectRedis = async (): Promise<Redis> => {
  if (redis) {
    return redis;
  }

  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  await redis.connect();
  return redis;
};

export const getRedis = (): Redis => {
  if (!redis) {
    throw new Error('Redis not connected. Call connectRedis() first.');
  }
  return redis;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redis) {
    await redis.quit();
    redis = null;
  }
};

export default redis;
