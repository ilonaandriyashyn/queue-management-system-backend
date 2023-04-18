import { Injectable } from '@nestjs/common'
import { Cron, Timeout } from '@nestjs/schedule'
import { TicketsService } from '../tickets/tickets.service'
import { MESSAGES } from '../helpers/messages'
import { SocketGateway } from '../gateway/gateway'
import { Ticket } from '../tickets/ticket.entity'
import { OfficesService } from '../offices/offices.service'

@Injectable()
export class ExpiredTicketsService {
  constructor(
    private readonly officesService: OfficesService,
    private readonly ticketsService: TicketsService,
    private readonly gateway: SocketGateway
  ) {}

  // every hour, at the start of the 10th minute
  // @Timeout(1000)
  @Cron('0 10 * * * *', {
    name: 'removeExpiredTickets'
  })
  async handleRemoveExpiredTickets() {
    const offices = await this.officesService.findAllOfficesWithServices()
    const ticketsToRemove: {
      [key: string]: Ticket[]
    } = {}
    for (const office of offices) {
      if (office.services.length !== 0) {
        const servicesIds = office.services.map((service) => service.id)
        const tickets = await this.ticketsService.findCreatedTicketsByServicesAndDate(servicesIds, office.ticketLife)
        if (tickets.length !== 0) {
          ticketsToRemove[office.id] = []
          ticketsToRemove[office.id].push(...tickets)
        }
      }
    }
    for (const officeID of Object.keys(ticketsToRemove)) {
      for (const ticket of ticketsToRemove[officeID]) {
        await this.ticketsService.removeTicketWithoutCheck(ticket.id)
      }
      this.gateway.server.emit(`${MESSAGES.ON_DELETE_TICKETS}/${officeID}`, ticketsToRemove[officeID])
    }
  }
}
