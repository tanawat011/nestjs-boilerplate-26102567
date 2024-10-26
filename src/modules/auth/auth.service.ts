import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { CustomerService } from '../customer/customer.service';
import { bcryptCheck } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userSvc: UserService,
    private customerSvc: CustomerService,
    private jwt: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userSvc.findOneByUsername(username);
    const isPasswordMatch = await bcryptCheck(pass, user.password);

    if (!isPasswordMatch) throw new UnauthorizedException();

    const payload = { sub: user.id, username: user.username, userType: 'user' };

    return {
      accessToken: await this.jwt.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRATION_ACCESS_TOKEN || '1h',
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRATION_REFRESH_TOKEN || '7d',
      }),
    };
  }

  async customerSignIn(username: string, pass: string): Promise<any> {
    const customer = await this.customerSvc.findOneByUsername(username);
    const isPasswordMatch = await bcryptCheck(pass, customer.password);

    if (!isPasswordMatch) throw new UnauthorizedException();

    const payload = { sub: customer.id, username: customer.username, userType: 'customer' };

    return {
      accessToken: await this.jwt.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRATION_ACCESS_TOKEN || '1h',
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRATION_REFRESH_TOKEN || '7d',
      }),
    };
  }
}
