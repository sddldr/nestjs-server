import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    // check if the user already exists
    const exist = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      throw new BadRequestException('this email has been registered');
    }

    // password hash
    const hash = await bcrypt.hash(password, 12);

    // create new user
    const user = await this.prisma.user.create({
      data: { email, password: hash },
      select: { id: true, email: true, createdAt: true },
    });

    return user;
  }

  async login(email: string, password: string) {
    // query user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, createdAt: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // generate token
    const token = this.generateToken(user.id);

    // return user info and token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      access_token: token,
    };
  }

  // generate JWT token
  generateToken(userId: number) {
    return this.jwtService.sign({ sub: userId });
  }
}
