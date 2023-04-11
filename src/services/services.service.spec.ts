import { Repository } from 'typeorm'
import { setupDataSource } from '../../connection'
import { ServicesService } from './services.service'
import { Service } from './service.entity'
import { Office, TicketLife } from '../offices/office.entity'
import { Organization } from '../organizations/organization.entity'

describe('Services service', () => {
  let servicesRepo: Repository<Service>
  let officesRepo: Repository<Office>
  let orgRepo: Repository<Organization>

  beforeEach(async () => {
    const dataSource = await setupDataSource()
    servicesRepo = dataSource.getRepository(Service)
    orgRepo = dataSource.getRepository(Organization)
    officesRepo = dataSource.getRepository(Office)
  })

  test('findServiceById', async () => {
    const org = {
      id: '3f561b51-9520-43d8-b3dc-ff21a799000a',
      name: 'Org 1'
    }
    await orgRepo.save(org)
    const office = {
      id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
      city: 'Prague',
      street: 'Karlova',
      countryCode: 'cz',
      postCode: '13400',
      building: '123',
      block: '111',
      ticketLife: TicketLife.HOURS24
    }
    await officesRepo.save({ ...office, organization: org })
    const serv = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
      name: 'Service 1',
      office
    }
    await servicesRepo.save(serv)
    const service = new ServicesService(servicesRepo)
    expect(await service.findServiceById('3f561b51-9520-43d8-b3dc-ff21a7990111')).toEqual(serv)
  })

  test('findServiceByIdWithOffice', async () => {
    const org = {
      id: '3f561b51-9520-43d8-b3dc-ff21a799000a',
      name: 'Org 1'
    }
    await orgRepo.save(org)
    const office = {
      id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
      city: 'Prague',
      street: 'Karlova',
      countryCode: 'cz',
      postCode: '13400',
      building: '123',
      block: '111',
      organization: org
    }
    await officesRepo.save(office)
    const serv = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
      name: 'Service 1',
      office
    }
    await servicesRepo.save(serv)
    const service = new ServicesService(servicesRepo)
    expect(await service.findServiceByIdWithOffice('3f561b51-9520-43d8-b3dc-ff21a7990111')).toEqual({
      ...serv,
      office: {
        ...office,
        services: [
          {
            id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
            name: 'Service 1'
          }
        ]
      }
    })
  })
})
