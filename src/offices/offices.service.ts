import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Office, TicketLife } from './office.entity'
import { Repository } from 'typeorm'
import { CreateOfficeDto, CreateServiceDto } from './offices.dto'
import { OrganizationsService } from '../organizations/organizations.service'
import { ServicesService } from '../services/services.service'
import { Service } from '../services/service.entity'
import { Cron } from '@nestjs/schedule'
import { TicketsService } from '../tickets/tickets.service'
import { MESSAGES } from '../helpers/messages'
import { SocketGateway } from '../gateway/gateway'
import { Ticket } from '../tickets/ticket.entity'

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private readonly officesRepository: Repository<Office>,
    private readonly organizationsService: OrganizationsService,
    private readonly servicesService: ServicesService,
    private readonly ticketsService: TicketsService,
    private readonly gateway: SocketGateway
  ) {}

  async createOffice(office: CreateOfficeDto) {
    const organization = await this.organizationsService.findOrganizationById(office.organizationId)
    if (!organization) {
      throw new BadRequestException()
    }
    const newOffice = this.officesRepository.create({
      block: office.block,
      city: office.city,
      building: office.building,
      countryCode: office.countryCode,
      street: office.street,
      postCode: office.postCode,
      organization
    })
    return this.officesRepository.save(newOffice)
  }

  findOfficeById(id: string) {
    return this.officesRepository.findOneBy({ id })
  }

  async findOfficeServices(id: string) {
    const office = await this.officesRepository.findOne({ relations: ['services'], where: { id } })
    if (!office) {
      throw new BadRequestException()
    }
    return office.services
  }

  async createService(id: string, service: CreateServiceDto) {
    const office = await this.findOfficeById(id)
    if (!office) {
      throw new BadRequestException()
    }
    return this.servicesService.createService(office, service)
  }

  async setServices(id: string, servicesIds: string[]) {
    const office = await this.officesRepository.findOne({ relations: ['services'], where: { id } })
    if (!office) {
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
        throw new BadRequestException()
      }
    }
    office.services = services
    return this.officesRepository.save(office)
  }

  async updateTicketLife(id: string, ticketLife: TicketLife) {
    const office = await this.officesRepository.findOne({ where: { id } })
    if (!office) {
      throw new BadRequestException()
    }
    office.ticketLife = ticketLife
    return this.officesRepository.save(office)
  }

  // every hour, at the start of the 10th minute
  @Cron('0 10 * * * *', {
    name: 'removeExpiredTickets'
  })
  async handleRemoveExpiredTickets() {
    const offices = await this.officesRepository.find({ relations: ['services'] })
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
