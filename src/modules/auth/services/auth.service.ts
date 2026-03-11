import prisma from '../../../config/prisma';
import { comparePassword } from '../../../utils/hash';
import { generateToken } from '../../../utils/jwt';
import { UnauthorizedError} from '../../../shared/errors/http-error';
import type LoginDto from '../dto/logindto';


export const authService = {
  
  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  },

 
};

export default authService;
