import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Ticket, TicketState } from './ticket.entity'
import { Repository } from 'typeorm'
import { CreateTicketDto } from './tickets.dto'
import { ServicesService } from '../services/services.service'

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly servicesService: ServicesService
  ) {}

  async createTicket(ticket: CreateTicketDto) {
    const service = await this.servicesService.findServiceById(ticket.serviceId)
    if (!service) {
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

  async updateTicketStateToProcessing(id: string) {
    const ticket = await this.findTicketById(id)
    if (!ticket) {
      throw new BadRequestException()
    }
    ticket.state = TicketState.PROCESSING
    return this.ticketsRepository.save(ticket)
  }

  async removeTicket(id: string) {
    const ticket = await this.findTicketById(id)
    if (!ticket || ticket.state !== TicketState.PROCESSING) {
      throw new BadRequestException()
    }
    return this.ticketsRepository.delete(id)
  }
}
