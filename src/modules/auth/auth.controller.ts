import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private svc: AuthService) {}

  @Post('login')
  async signIn(
    @Body() signInDto: { username: string; password: string },
    @Session() session: any,
  ) {
    const user = await this.svc.signIn(signInDto.username, signInDto.password);

    if (user) {
      session.store = user;
    }

    return 'Logged in';
  }

  @Post('login/customer')
  async customerSignIn(
    @Body() signInDto: { username: string; password: string },
    @Session() session: any,
  ) {
    const customer = await this.svc.customerSignIn(signInDto.username, signInDto.password);

    if (customer) {
      session.store = customer;
    }

    return 'Logged in';
  }

  @Get('logout')
  async signOut(@Session() session: any) {
    session.destroy();

    return 'Logged out';
  }
}
