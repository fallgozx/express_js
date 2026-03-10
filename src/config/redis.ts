import { createClient, RedisClientType } from 'redis';
import env from './env';

let redisClient: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = createClient({
    url: env.REDIS_URL,
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));

  await redisClient.connect();

  return redisClient;
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis first.');
  }
  return redisClient;
};

export default connectRedis;
