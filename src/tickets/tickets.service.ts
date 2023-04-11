import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Ticket, TicketState } from './ticket.entity'
import { Repository } from 'typeorm'
import { CreateTicketDto } from './tickets.dto'
import { ServicesService } from '../services/services.service'
import { Service } from '../services/service.entity'
import { SocketGateway } from '../gateway/gateway'
import { MESSAGES } from '../helpers/messages'
import { TicketLife } from '../offices/office.entity'

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly servicesService: ServicesService,
    private readonly gateway: SocketGateway
  ) {}

  async createTicket(ticket: CreateTicketDto) {
    const service = await this.servicesService.findServiceByIdWithOffice(ticket.serviceId)
    if (!service || !service.office || !service.office.organization) {
      throw new BadRequestException()
    }
    const ticketsForDevice = await this.findTicketsForDevice(ticket.phoneId)
    if (ticketsForDevice >= 5) {
      throw new BadRequestException()
    }
    const ticketExists = await this.findTicketByServiceAndDevice(service.id, ticket.phoneId)
    if (ticketExists !== null) {
      throw new BadRequestException()
    }
    const serviceIds = service.office.services.map((service) => service.id)
    const ticketWithHighestNumber = await this.findTicketWithHighestNumberByServices(serviceIds)
    const newTicketNumber = ticketWithHighestNumber === null ? 1 : ticketWithHighestNumber.ticketNumber + 1
    const newTicket = this.ticketsRepository.create({
      phoneId: ticket.phoneId,
      ticketNumber: newTicketNumber,
      service
    })
    await this.ticketsRepository.save(newTicket)
    this.gateway.server.emit(`${MESSAGES.ON_UPDATE_QUEUE}/${service.office.id}/${service.id}`, {
      ...newTicket,
      counter: null
    })
  }

  findTicketById(id: string) {
    return this.ticketsRepository.findOneBy({ id })
  }

  removeTicketWithoutCheck(id: string) {
    return this.ticketsRepository.delete(id)
  }

  async removeTicket(id: string) {
    const ticket = await this.findTicketById(id)
    if (!ticket || ticket.state !== TicketState.PROCESSING) {
      throw new BadRequestException()
    }
    return this.ticketsRepository.delete(id)
  }

  async findCreatedTicketsByServices(serviceIds: string[]) {
    return this.ticketsRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.service', 'service')
      .where('service.id IN (:...serviceIds)', { serviceIds })
      .andWhere('tickets.state=:ticketState', { ticketState: TicketState.CREATED })
      .orderBy('tickets.dateCreated', 'ASC')
      .getMany()
  }

  // TODO do we need order by here? If not fix in text as well.
  async findCreatedTicketsByServicesAndDate(serviceIds: string[], ticketLife: TicketLife) {
    return this.ticketsRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.service', 'service')
      .where('service.id IN (:...serviceIds)', { serviceIds })
      .andWhere('tickets.state=:ticketState', { ticketState: TicketState.CREATED })
      .andWhere("(tickets.dateCreated + INTERVAL '1 hour' * :ticketLife)<=NOW()", { ticketLife })
      .orderBy('tickets.dateCreated', 'ASC')
      .getMany()
  }

  async findAllTicketsByService(serviceId: string) {
    return this.ticketsRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.service', 'service')
      .leftJoinAndSelect('tickets.counter', 'counter')
      .where('service.id=:serviceId', { serviceId })
      .orderBy('tickets.dateCreated', 'ASC')
      .getMany()
  }

  // TODO maybe get the highest number based on office, not on services.
  async findTicketWithHighestNumberByServices(serviceIds: string[]) {
    return this.ticketsRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.service', 'service')
      .where('service.id IN (:...serviceIds)', { serviceIds })
      .orderBy('tickets.ticketNumber', 'DESC')
      .getOne()
  }

  async findTicketByServiceAndDevice(serviceId: string, phoneId: string) {
    return this.ticketsRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.service', 'service')
      .leftJoinAndSelect('tickets.counter', 'counter')
      .where('service.id=:serviceId', { serviceId })
      .andWhere('tickets.phoneId=:phoneId', { phoneId })
      .getOne()
  }

  async findTicketsForDevice(phoneId: string) {
    return this.ticketsRepository
      .createQueryBuilder('tickets')
      .where('tickets.phoneId=:phoneId', { phoneId })
      .getCount()
  }

  // TODO maybe refactor to query builder
  async findNextByServices(services: Service[]) {
    const servicesIds = services.map((service) => service.id)
    const tickets = await this.ticketsRepository.find({
      relations: ['service', 'counter'],
      order: { dateCreated: 'ASC' }
    })
    for (const t of tickets) {
      if (servicesIds.includes(t.service.id) && t.state === TicketState.CREATED) {
        t.state = TicketState.PROCESSING
        await this.ticketsRepository.save(t)
        return t
      }
    }
    return null
  }
}
