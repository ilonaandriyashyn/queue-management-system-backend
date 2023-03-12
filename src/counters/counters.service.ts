import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Counter } from './counter.entity'
import { Repository } from 'typeorm'
import { CreateCounterDto } from './counters.dto'
import { OfficesService } from '../offices/offices.service'
import { Service } from '../services/service.entity'
import { ServicesService } from '../services/services.service'

@Injectable()
export class CountersService {
  constructor(
    @InjectRepository(Counter)
    private readonly countersRepository: Repository<Counter>,
    private readonly officesService: OfficesService,
    private readonly servicesService: ServicesService
  ) {}

  async createCounter(counter: CreateCounterDto) {
    const office = await this.officesService.findOfficeById(counter.officeId)
    if (!office) {
      throw new BadRequestException()
    }
    const newCounter = this.countersRepository.create({
      name: counter.name,
      office
    })
    return this.countersRepository.save(newCounter)
  }

  async setServices(id: string, servicesIds: string[]) {
    const counter = await this.findCounterById(id)
    if (!counter) {
      throw new BadRequestException()
    }
    const services: Service[] = []
    for (const serviceId of servicesIds) {
      const service = await this.servicesService.findServiceById(serviceId)
      if (service) {
        services.push(service)
      }
    }
    counter.services = services
    return this.countersRepository.save(counter)
  }

  findCounterById(id: string) {
    return this.countersRepository.findOneBy({ id })
  }
}