import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Ticket } from './ticket.entity'
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
}
