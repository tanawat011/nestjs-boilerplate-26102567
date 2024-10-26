import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(private svc: CustomerService) {}

  @Get()
  async findAll(): Promise<Customer[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Customer | null> {
    return this.svc.findOne(id);
  }

  @Post()
  async create(@Body() customer: Customer): Promise<Customer> {
    return this.svc.create(customer);
  }

  @Patch(':id')
  async update(@Param() { id }, @Body() customer: Customer): Promise<Customer> {
    return this.svc.update(id, customer);
  }

  @Post(':id/delete')
  async remove(id: number): Promise<void> {
    return this.svc.remove(id);
  }
}
