import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';
import { bcryptHash } from 'src/utils/bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private repo: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.repo.find({
      select: ['id', 'username', 'firstName', 'lastName'],
    });
  }

  async findOne(id: number): Promise<Customer | null> {
    return this.repo
      .createQueryBuilder('customer')
      .where('customer.id = :id', { id })
      .select([
        'customer.id',
        'customer.username',
        'customer.firstName',
        'customer.lastName',
      ])
      .getOne();
  }

  async findOneByUsername(username: string): Promise<Customer | null> {
    return this.repo.findOneBy({ username });
  }

  async create(customer: Customer): Promise<Customer> {
    return this.repo.save({
      ...customer,
      password: await bcryptHash(customer.password),
    });
  }

  async update(id: number, customer: Customer): Promise<Customer> {
    await this.repo.update(id, {
      ...customer,
      password: await bcryptHash(customer.password),
    });
    return this.repo
      .createQueryBuilder('customer')
      .where('customer.id = :id', { id })
      .select([
        'customer.id',
        'customer.username',
        'customer.firstName',
        'customer.lastName',
      ])
      .getOne();
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
