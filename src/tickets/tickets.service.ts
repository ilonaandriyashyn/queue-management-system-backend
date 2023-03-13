import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Ticket, TicketState } from './ticket.entity'
import { Repository } from 'typeorm'
import { CreateTicketDto } from './tickets.dto'
import { ServicesService } from '../services/services.service'
import { Service } from '../services/service.entity'

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly servicesService: ServicesService
  ) {}

  async createTicket(ticket: CreateTicketDto) {
    const service = await this.servicesService.findServiceById(ticket.serviceId)
    if (!service || !service.office || !service.office.organization) {
      throw new BadRequestException()
    }
    const newTicket = this.ticketsRepository.create({
      phoneId: ticket.phoneId,
      service
    })
    return this.ticketsRepository.save(newTicket)
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

  async findByServices(services: Service[]) {
    const servicesIds = services.map((service) => service.id)
    const tickets = await this.ticketsRepository.find({ relations: ['service'] })
    const selectedTickets = []
    for (const t of tickets) {
      if (servicesIds.includes(t.service.id)) {
        selectedTickets.push(t)
      }
    }
    return tickets
  }

  async findNextByServices(services: Service[]) {
    const servicesIds = services.map((service) => service.id)
    const tickets = await this.ticketsRepository.find({ relations: ['service'] })
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
