import { Repository } from 'typeorm'
import { setupDataSource } from '../../connection'
import { Organization } from '../organizations/organization.entity'
import { Service } from '../services/service.entity'
import { ServicesService } from '../services/services.service'
import { BadRequestException } from '@nestjs/common'
import { Office } from '../offices/office.entity'
import { Printer } from './printer.entity'
import { PrintersService } from './printers.service'
import { OfficesService } from '../offices/offices.service'
import { OrganizationsService } from '../organizations/organizations.service'

describe('Printers service', () => {
  let officesRepo: Repository<Office>
  let orgRepo: Repository<Organization>
  let servicesRepo: Repository<Service>
  let officesService: OfficesService
  let organizationsService: OrganizationsService
  let servicesService: ServicesService
  let printersRepo: Repository<Printer>

  beforeEach(async () => {
    const dataSource = await setupDataSource()
    officesRepo = dataSource.getRepository(Office)
    orgRepo = dataSource.getRepository(Organization)
    servicesRepo = dataSource.getRepository(Service)
    printersRepo = dataSource.getRepository(Printer)
    organizationsService = new OrganizationsService(orgRepo)
    servicesService = new ServicesService(servicesRepo)
    officesService = new OfficesService(officesRepo, organizationsService, servicesService)
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
