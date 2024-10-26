import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private svc: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  async findOne(id: number): Promise<User | null> {
    return this.svc.findOne(id);
  }

  @Post()
  async create(@Body() User: User): Promise<User> {
    return this.svc.create(User);
  }

  @Patch(':id')
  async update(@Param() { id }, @Body() User: User): Promise<User> {
    return this.svc.update(id, User);
  }

  @Post(':id/delete')
  async remove(id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
