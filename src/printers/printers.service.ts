import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Printer } from './printer.entity'
import { Repository } from 'typeorm'
import { OfficesService } from '../offices/offices.service'

@Injectable()
export class PrintersService {
  constructor(
    @InjectRepository(Printer)
    private readonly printersRepository: Repository<Printer>,
    private readonly officesService: OfficesService
  ) {}

  async createPrinter(officeId: string) {
    const office = await this.officesService.findOfficeById(officeId)
    if (office === null) {
      throw new BadRequestException()
    }
    const printer = await this.printersRepository.create({ office })
    return this.printersRepository.save(printer)
  }

  async findPrinterByKey(key: string) {
    return this.printersRepository.findOne({ relations: ['office'], where: { key } })
  }
}
