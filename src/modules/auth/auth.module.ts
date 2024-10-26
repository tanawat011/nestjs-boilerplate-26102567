import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [UserModule, CustomerModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
