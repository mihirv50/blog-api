import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    if (!signupDto.email || !signupDto.password || !signupDto.username) {
      throw new BadRequestException('Please provide all required fields');
    }
    const existingUser = await this.userModel.findOne({
      email: signupDto.email,
    });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    try {
      const hashedPassword = await bcrypt.hash(signupDto.password, 10);
      const user = await this.userModel.create({
        username: signupDto.username,
        email: signupDto.email,
        password: hashedPassword,
      });
      return {
        msg: 'User created successfully',
        email: user.email,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async signin(signinDto: SigninDto) {
    try {
      const user = await this.userModel.findOne({
        email: signinDto.email,
      });
      if (!user) {
        throw new Error('User not found');
      }
      const passwordMatch = await bcrypt.compare(
        signinDto.password,
        user.password,
      );
      if (!passwordMatch) {
        throw new Error('Invalid credentials');
      }
      const token = await this.jwtService.signAsync(
      { id: user._id },
      {
        secret: this.configService.get('JWT_SECRET')
      },
    );
      return {
        msg: 'Signin successful',
        token: token,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
