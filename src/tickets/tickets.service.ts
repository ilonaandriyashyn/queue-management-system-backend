import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Ticket, TicketState } from './ticket.entity'
import { Repository } from 'typeorm'
import { CreateTicketDto } from './tickets.dto'
import { ServicesService } from '../services/services.service'
import { Service } from '../services/service.entity'
import { SocketGateway } from '../gateway/gateway'
import { MESSAGES } from '../helpers/messages'

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
    const newTicket = this.ticketsRepository.create({
      phoneId: ticket.phoneId,
      service
    })
    await this.ticketsRepository.save(newTicket)
    // const tickets = await this.findCreatedTicketsByService(service.id)
    // console.log('emitting to', `${MESSAGES.ON_UPDATE_QUEUE}/${service.office.id}/${service.id}`)
    this.gateway.server.emit(`${MESSAGES.ON_UPDATE_QUEUE}/${service.office.id}/${service.id}`, ticket)
  }

  findTicketById(id: string) {
    return this.ticketsRepository.findOneBy({ id })
  }

  // async updateTicketStateToProcessing(id: string) {
  //   const ticket = await this.findTicketById(id)
  //   if (!ticket) {
  //     throw new BadRequestException()
  //   }
  //   ticket.state = TicketState.PROCESSING
  //   return this.ticketsRepository.save(ticket)
  // }

  async removeTicket(id: string) {
    const ticket = await this.findTicketById(id)
    if (!ticket || ticket.state !== TicketState.PROCESSING) {
      throw new BadRequestException()
    }
    return this.ticketsRepository.delete(id)
  }

  // async countTicketsByService(serviceId: string) {
  //   return this.ticketsRepository
  //     .createQueryBuilder('tickets')
  //     .leftJoinAndSelect('tickets.service', 'service')
  //     .where('service.id=:serviceId', { serviceId })
  //     .getCount()
  // }

  async findCreatedTicketsByService(serviceId: string) {
    return this.ticketsRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.service', 'service')
      .where('service.id=:serviceId', { serviceId })
      .andWhere('tickets.state=:ticketState', { ticketState: TicketState.CREATED })
      .orderBy('tickets.dateCreated', 'ASC')
      .getMany()
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

  async findAllTicketsByService(serviceId: string) {
    return this.ticketsRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.service', 'service')
      .where('service.id=:serviceId', { serviceId })
      .orderBy('tickets.dateCreated', 'ASC')
      .getMany()
  }

  async findNextByServices(services: Service[]) {
    const servicesIds = services.map((service) => service.id)
    const tickets = await this.ticketsRepository.find({ relations: ['service'], order: { dateCreated: 'ASC' } })
    for (const t of tickets) {
      if (servicesIds.includes(t.service.id)) {
        t.state = TicketState.PROCESSING
        await this.ticketsRepository.save(t)
        return t
      }
    }
    return null
  }
}
