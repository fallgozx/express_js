import { userRepository } from '../repositories/user.repository';
import { getRedisClient } from '../config/redis';

export interface UpdateUserInput {
  email?: string;
  name?: string;
}

export const userService = {
  async findAll() {
    const redis = getRedisClient();
    const cacheKey = 'users:all';

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const users = await Promise.resolve(
      // @ts-ignore - User model would be from Prisma
      userRepository.findMany?.() || []
    );

    await redis.setEx(cacheKey, 300, JSON.stringify(users));
    return users;
  },

  async findById(id: string) {
    const redis = getRedisClient();
    const cacheKey = `users:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const user = await userRepository.findById(id);
    if (user) {
      await redis.setEx(cacheKey, 300, JSON.stringify(user));
    }
    return user;
  },

  async update(id: string, input: UpdateUserInput) {
    const user = await userRepository.update(id, input);

    const redis = getRedisClient();
    await redis.del(`users:${id}`);
    await redis.del('users:all');

    return user;
  },

  async delete(id: string) {
    const user = await userRepository.delete(id);

    const redis = getRedisClient();
    await redis.del(`users:${id}`);
    await redis.del('users:all');

    return user;
  },
};

export default userService;
