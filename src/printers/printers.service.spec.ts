import { Repository } from 'typeorm'
import { setupDataSource } from '../../connection'
import { Organization } from '../organizations/organization.entity'
import { Service } from '../services/service.entity'
import { ServicesService } from '../services/services.service'
import { BadRequestException } from '@nestjs/common'
import { Office } from '../offices/office.entity'
import { SocketGateway } from '../gateway/gateway'
import { Printer } from './printer.entity'
import { PrintersService } from './printers.service'
import { OfficesService } from '../offices/offices.service'
import { Ticket } from '../tickets/ticket.entity'
import { OrganizationsService } from '../organizations/organizations.service'
import { TicketsService } from '../tickets/tickets.service'

describe('Printers service', () => {
  let officesRepo: Repository<Office>
  let orgRepo: Repository<Organization>
  let servicesRepo: Repository<Service>
  let ticketsRepo: Repository<Ticket>
  let officesService: OfficesService
  let organizationsService: OrganizationsService
  let servicesService: ServicesService
  let ticketsService: TicketsService
  let printersRepo: Repository<Printer>
  let gateway: SocketGateway

  beforeEach(async () => {
    const dataSource = await setupDataSource()
    officesRepo = dataSource.getRepository(Office)
    orgRepo = dataSource.getRepository(Organization)
    servicesRepo = dataSource.getRepository(Service)
    printersRepo = dataSource.getRepository(Printer)
    ticketsRepo = dataSource.getRepository(Ticket)
    organizationsService = new OrganizationsService(orgRepo)
    servicesService = new ServicesService(servicesRepo)
    gateway = new SocketGateway()
    ticketsService = new TicketsService(ticketsRepo, servicesService, gateway)
    officesService = new OfficesService(officesRepo, organizationsService, servicesService, ticketsService, gateway)
  })

  describe('createPrinter', () => {
    test('office is not found', async () => {
      const office = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      await officesRepo.save(office)
      const service = new PrintersService(printersRepo, officesService)
      await expect(service.createPrinter('3f561b51-9520-43d8-b3dc-ff21a7990001')).rejects.toThrow(BadRequestException)
    })

    test('creates printer', async () => {
      const office = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      await officesRepo.save(office)
      const service = new PrintersService(printersRepo, officesService)
      expect(await service.createPrinter('3f561b51-9520-43d8-b3dc-ff21a799000d')).toEqual(
        expect.objectContaining({
          office
        })
      )
    })
  })
})
