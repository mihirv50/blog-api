import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtGuard } from '../auth/guards/index';
import { GetUser } from 'src/auth/decorators/index';
import { User } from './schemas/user.schema';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor() {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
