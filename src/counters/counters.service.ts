import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Counter } from './counter.entity'
import { Repository } from 'typeorm'
import { CreateCounterDto } from './counters.dto'
import { OfficesService } from '../offices/offices.service'
import { Service } from '../services/service.entity'
import { ServicesService } from '../services/services.service'
import { TicketsService } from '../tickets/tickets.service'

@Injectable()
export class CountersService {
  constructor(
    @InjectRepository(Counter)
    private readonly countersRepository: Repository<Counter>,
    private readonly officesService: OfficesService,
    private readonly servicesService: ServicesService,
    private readonly ticketsService: TicketsService
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
      try {
        const service = await this.servicesService.findServiceById(serviceId)
        if (service) {
          services.push(service)
        }
      } catch (e) {
        // TODO modify, check for different errors. This error happens when serviceId is not uuid
        throw new BadRequestException()
      }
    }
    counter.services = services
    return this.countersRepository.save(counter)
  }

  findCounterById(id: string) {
    return this.countersRepository.findOneBy({ id })
  }

  async doneTicket(id: string) {
    const counter = await this.countersRepository.findOne({ relations: ['ticket'], where: { id } })
    if (!counter || counter.ticket === null) {
      throw new BadRequestException()
    }
    return this.ticketsService.removeTicket(counter.ticket.id)
  }

  async nextTicket(id: string) {
    const counter = await this.countersRepository.findOne({
      relations: ['ticket', 'services'],
      where: { id }
    })
    if (!counter || counter.ticket !== null) {
      throw new BadRequestException()
    }
    counter.ticket = await this.ticketsService.findNextByServices(counter.services)
    return this.countersRepository.save(counter)
  }
}
