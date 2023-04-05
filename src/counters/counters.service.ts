import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Counter } from './counter.entity'
import { Repository } from 'typeorm'
import { CreateCounterDto } from './counters.dto'
import { OfficesService } from '../offices/offices.service'
import { Service } from '../services/service.entity'
import { ServicesService } from '../services/services.service'
import { TicketsService } from '../tickets/tickets.service'
import { SocketGateway } from '../gateway/gateway'
import { MESSAGES } from '../helpers/messages'

@Injectable()
export class CountersService {
  constructor(
    @InjectRepository(Counter)
    private readonly countersRepository: Repository<Counter>,
    private readonly officesService: OfficesService,
    private readonly servicesService: ServicesService,
    private readonly ticketsService: TicketsService,
    private readonly gateway: SocketGateway
  ) {}

  // TODO think about moving it to offices controller
  async createCounter(counter: CreateCounterDto) {
    const office = await this.officesService.findOfficeById(counter.officeId)
    if (!office) {
      throw new BadRequestException()
    }
    const counterFound = await this.countersRepository
      .createQueryBuilder('counter')
      .leftJoinAndSelect('counter.office', 'office')
      .where('office.id=:officeId', { officeId: office.id })
      .andWhere('counter.name=:counterName', { counterName: counter.name })
      .getOne()
    if (counterFound) {
      return counterFound
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
        if (service && service.office.id === counter.office.id) {
          services.push(service)
        }
      } catch (e) {
        throw new BadRequestException()
      }
    }
    counter.services = services
    return this.countersRepository.save(counter)
  }

  findCounterById(id: string) {
    return this.countersRepository.findOne({ relations: ['office'], where: { id } })
  }

  async doneTicket(id: string) {
    const counter = await this.countersRepository.findOne({ relations: ['ticket'], where: { id } })
    if (!counter || counter.ticket === null) {
      throw new BadRequestException()
    }
    return this.ticketsService.removeTicket(counter.ticket.id)
  }

  // It is generated for based on service that counter has, but the services id are different for each office,
  // so it's ok to just look for tickets based on these services
  async nextTicket(id: string) {
    const counter = await this.countersRepository.findOne({
      relations: ['ticket', 'ticket.service', 'services', 'office'],
      where: { id }
    })
    if (!counter || counter.ticket !== null) {
      throw new BadRequestException()
    }
    counter.ticket = await this.ticketsService.findNextByServices(counter.services)
    await this.countersRepository.save(counter)
    if (counter.ticket !== null) {
      // TODO maybe rename topic to ADD_TICKET
      this.gateway.server.emit(
        `${MESSAGES.ON_UPDATE_QUEUE}/${counter.office.id}/${counter.ticket.service.id}`,
        counter.ticket
      )
    }
    return counter.ticket
  }

  async getCurrentTicket(id: string) {
    const counter = await this.countersRepository.findOne({
      relations: ['ticket', 'ticket.service'],
      where: { id }
    })
    if (!counter) {
      throw new BadRequestException()
    }
    return counter.ticket
  }

  async findCreatedTickets(id: string) {
    const counter = await this.countersRepository.findOne({
      relations: ['services'],
      where: { id }
    })
    if (!counter) {
      throw new BadRequestException()
    }
    const serviceIds = counter.services.map((service) => service.id)
    return await this.ticketsService.findCreatedTicketsByServices(serviceIds)
  }
}
