import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Printer } from './printer.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PrintersService {
  constructor(
    @InjectRepository(Printer)
    private readonly printersRepository: Repository<Printer>
  ) {}

  async createPrinter() {
    console.log('in service')
    const res = await this.printersRepository.create()
    return this.printersRepository.save(res)
  }
}
