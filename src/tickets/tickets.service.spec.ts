import { Repository } from 'typeorm'
import { setupDataSource } from '../../connection'
import { Organization } from '../organizations/organization.entity'
import { Service } from '../services/service.entity'
import { ServicesService } from '../services/services.service'
import { BadRequestException } from '@nestjs/common'
import { Office } from '../offices/office.entity'
import { SocketGateway } from '../gateway/gateway'
import { MESSAGES } from '../helpers/messages'
import { TicketsService } from './tickets.service'
import { Ticket, TicketState } from './ticket.entity'

describe('Tickets service', () => {
  let officesRepo: Repository<Office>
  let orgRepo: Repository<Organization>
  let servicesRepo: Repository<Service>
  let ticketsRepo: Repository<Ticket>
  let servicesService: ServicesService
  let gateway: SocketGateway

  beforeEach(async () => {
    const dataSource = await setupDataSource()
    officesRepo = dataSource.getRepository(Office)
    orgRepo = dataSource.getRepository(Organization)
    servicesRepo = dataSource.getRepository(Service)
    ticketsRepo = dataSource.getRepository(Ticket)
    servicesService = new ServicesService(servicesRepo)
    gateway = new SocketGateway()
  })

  describe('createTicket', () => {
    test('service is not found', async () => {
      const serv1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990555',
        name: 'Service 1'
      }
      await servicesRepo.save(serv1)
      const service = new TicketsService(ticketsRepo, servicesService, gateway)
      await expect(
        service.createTicket({ phoneId: '12345678', serviceId: '3f561b51-9520-43d8-b3dc-ff21a7990001' })
      ).rejects.toThrow(BadRequestException)
    })

    test('service does not have office', async () => {
      const serv1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        name: 'Service 1'
      }
      await servicesRepo.save(serv1)
      const service = new TicketsService(ticketsRepo, servicesService, gateway)
      await expect(
        service.createTicket({ phoneId: '12345678', serviceId: '3f561b51-9520-43d8-b3dc-ff21a7990001' })
      ).rejects.toThrow(BadRequestException)
    })

    test('services office does not have organization', async () => {
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
      const serv1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        name: 'Service 1',
        office
      }
      await servicesRepo.save(serv1)
      const service = new TicketsService(ticketsRepo, servicesService, gateway)
      await expect(
        service.createTicket({ phoneId: '12345678', serviceId: '3f561b51-9520-43d8-b3dc-ff21a7990001' })
      ).rejects.toThrow(BadRequestException)
    })

    test('device exceeded its ticket limit', async () => {
      const organization = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000a',
        name: 'Org 1'
      }
      await orgRepo.save(organization)
      const office = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111',
        organization
      }
      await officesRepo.save(office)
      const serv1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        name: 'Service 1',
        office
      }
      await servicesRepo.save(serv1)
      const ticket1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:16:01.933Z',
        phoneId: '123456789',
        state: TicketState.PROCESSING,
        service: serv1
      }
      const ticket2 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990223',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:47:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv1
      }
      const ticket3 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990224',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:18:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv1
      }
      const ticket4 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990225',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:38:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv1
      }
      const ticket5 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990226',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:38:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv1
      }
      await ticketsRepo.save([ticket1, ticket2, ticket3, ticket4, ticket5])
      const service = new TicketsService(ticketsRepo, servicesService, gateway)
      await expect(
        service.createTicket({ phoneId: '123456789', serviceId: '3f561b51-9520-43d8-b3dc-ff21a7990001' })
      ).rejects.toThrow(BadRequestException)
    })

    test('ticket from device for service already exists', async () => {
      const organization = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000a',
        name: 'Org 1'
      }
      await orgRepo.save(organization)
      const office = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111',
        organization
      }
      await officesRepo.save(office)
      const serv1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        name: 'Service 1',
        office
      }
      await servicesRepo.save(serv1)
      const ticket1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:16:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv1
      }
      await ticketsRepo.save(ticket1)
      const service = new TicketsService(ticketsRepo, servicesService, gateway)
      await expect(
        service.createTicket({ phoneId: '123456789', serviceId: '3f561b51-9520-43d8-b3dc-ff21a7990001' })
      ).rejects.toThrow(BadRequestException)
    })

    test('creates ticket', async () => {
      const organization = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000a',
        name: 'Org 1'
      }
      await orgRepo.save(organization)
      const office = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111',
        organization
      }
      await officesRepo.save(office)
      const serv1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        name: 'Service 1',
        office
      }
      const serv2 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990002',
        name: 'Service 2',
        office
      }
      await servicesRepo.save([serv1, serv2])
      const ticket1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:16:01.933Z',
        phoneId: '123456789',
        state: TicketState.PROCESSING,
        service: serv1
      }
      const ticket2 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990223',
        ticketNumber: 124,
        dateCreated: '2022-07-13T18:47:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv1
      }
      const ticket3 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990224',
        ticketNumber: 125,
        dateCreated: '2022-07-13T18:18:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv1
      }
      const ticket4 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990225',
        ticketNumber: 126,
        dateCreated: '2022-07-13T18:38:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv1
      }
      await ticketsRepo.save([ticket1, ticket2, ticket3, ticket4])
      gateway = new SocketGateway()
      const emit = jest.fn()
      // @ts-expect-error no need to mock everything
      gateway.server = {
        emit
      }
      const service = new TicketsService(ticketsRepo, servicesService, gateway)
      await service.createTicket({ phoneId: '123456789', serviceId: '3f561b51-9520-43d8-b3dc-ff21a7990002' })
      expect(await ticketsRepo.findOne({ where: { ticketNumber: 127 } })).toEqual(
        expect.objectContaining({
          phoneId: '123456789',
          state: TicketState.CREATED,
          ticketNumber: 127
        })
      )
      expect(emit).toHaveBeenCalledWith(
        `${MESSAGES.ON_UPDATE_QUEUE}/${office.id}/${serv2.id}`,
        expect.objectContaining({
          phoneId: '123456789',
          state: TicketState.CREATED,
          ticketNumber: 127,
          counter: null
        })
      )
    })
  })

  describe('removeTicket', () => {
    test('ticket is not found', async () => {
      const ticket1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:16:01.933Z',
        phoneId: '123456789',
        state: TicketState.PROCESSING
      }
      await ticketsRepo.save(ticket1)
      const service = new TicketsService(ticketsRepo, servicesService, gateway)
      await expect(service.removeTicket('3f561b51-9520-43d8-b3dc-ff21a7990001')).rejects.toThrow(BadRequestException)
    })

    test('ticket is in state created', async () => {
      const ticket1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:16:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED
      }
      await ticketsRepo.save(ticket1)
      const service = new TicketsService(ticketsRepo, servicesService, gateway)
      await expect(service.removeTicket('3f561b51-9520-43d8-b3dc-ff21a7990222')).rejects.toThrow(BadRequestException)
    })

    test('deletes ticket', async () => {
      const ticket1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:16:01.933Z',
        phoneId: '123456789',
        state: TicketState.PROCESSING
      }
      await ticketsRepo.save(ticket1)
      const service = new TicketsService(ticketsRepo, servicesService, gateway)
      expect(await service.removeTicket('3f561b51-9520-43d8-b3dc-ff21a7990222')).toEqual({
        affected: 1,
        raw: []
      })
    })
  })

  test('findCreatedTicketsByServices', async () => {
    const serv1 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
      name: 'Service 1'
    }
    const serv2 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990112',
      name: 'Service 2'
    }
    const serv3 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990113',
      name: 'Service 3'
    }
    await servicesRepo.save([serv1, serv2, serv3])
    const ticket1 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990221',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.PROCESSING,
      service: serv1
    }
    const ticket2 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv2
    }
    const ticket3 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990223',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv3
    }
    const ticket4 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990224',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:15:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv1
    }
    const ticket5 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990225',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:17:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv1
    }
    await ticketsRepo.save([ticket1, ticket2, ticket3, ticket4, ticket5])
    const service = new TicketsService(ticketsRepo, servicesService, gateway)
    expect(
      await service.findCreatedTicketsByServices([
        '3f561b51-9520-43d8-b3dc-ff21a7990111',
        '3f561b51-9520-43d8-b3dc-ff21a7990112'
      ])
    ).toEqual([ticket4, ticket2, ticket5])
  })

  test('findAllTicketsByService', async () => {
    const serv1 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
      name: 'Service 1'
    }
    const serv2 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990112',
      name: 'Service 2'
    }
    const serv3 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990113',
      name: 'Service 3'
    }
    await servicesRepo.save([serv1, serv2, serv3])
    const ticket1 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990221',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.PROCESSING,
      service: serv1
    }
    const ticket2 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv2
    }
    const ticket3 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990223',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv3
    }
    const ticket4 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990224',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:15:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv1
    }
    const ticket5 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990225',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:17:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv1
    }
    await ticketsRepo.save([ticket1, ticket2, ticket3, ticket4, ticket5])
    const service = new TicketsService(ticketsRepo, servicesService, gateway)
    expect(await service.findAllTicketsByService('3f561b51-9520-43d8-b3dc-ff21a7990111')).toEqual([
      {
        ...ticket4,
        counter: null
      },
      {
        ...ticket1,
        counter: null
      },
      {
        ...ticket5,
        counter: null
      }
    ])
  })

  test('findTicketWithHighestNumberByOffice', async () => {
    const office1 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
      city: 'Prague',
      street: 'Karlova',
      countryCode: 'cz',
      postCode: '13400',
      building: '123',
      block: '111'
    }
    const office2 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a799000a',
      city: 'Prague',
      street: 'Karlova',
      countryCode: 'cz',
      postCode: '13400',
      building: '123',
      block: '111'
    }
    await officesRepo.save([office1, office2])
    const serv1 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
      name: 'Service 1',
      office: office1
    }
    const serv2 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990112',
      name: 'Service 2',
      office: office2
    }
    const serv3 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990113',
      name: 'Service 3',
      office: office1
    }
    await servicesRepo.save([serv1, serv2, serv3])
    const ticket1 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990221',
      ticketNumber: 345,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.PROCESSING,
      service: serv1
    }
    const ticket2 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
      ticketNumber: 890,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv2
    }
    const ticket3 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990223',
      ticketNumber: 113,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv3
    }
    const ticket4 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990224',
      ticketNumber: 125,
      dateCreated: '2022-07-13T18:15:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv1
    }
    const ticket5 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990225',
      ticketNumber: 127,
      dateCreated: '2022-07-13T18:17:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv1
    }
    await ticketsRepo.save([ticket1, ticket2, ticket3, ticket4, ticket5])
    const service = new TicketsService(ticketsRepo, servicesService, gateway)
    expect(await service.findTicketWithHighestNumberByOffice('3f561b51-9520-43d8-b3dc-ff21a799000d')).toEqual(ticket1)
  })

  test('findTicketByServiceAndDevice', async () => {
    const serv1 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
      name: 'Service 1'
    }
    const serv2 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990112',
      name: 'Service 2'
    }
    const serv3 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990113',
      name: 'Service 3'
    }
    await servicesRepo.save([serv1, serv2, serv3])
    const ticket1 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990221',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123',
      state: TicketState.PROCESSING,
      service: serv1
    }
    const ticket2 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv2
    }
    const ticket3 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990223',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv3
    }
    const ticket4 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990224',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:15:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv1
    }
    const ticket5 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990225',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:17:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED,
      service: serv1
    }
    await ticketsRepo.save([ticket1, ticket2, ticket3, ticket4, ticket5])
    const service = new TicketsService(ticketsRepo, servicesService, gateway)
    expect(await service.findTicketByServiceAndDevice('3f561b51-9520-43d8-b3dc-ff21a7990111', '123')).toEqual({
      ...ticket1,
      counter: null
    })
  })

  test('findTicketsForDevice', async () => {
    const ticket1 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990221',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123',
      state: TicketState.PROCESSING
    }
    const ticket2 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED
    }
    const ticket3 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990223',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:16:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED
    }
    const ticket4 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990224',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:15:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED
    }
    const ticket5 = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990225',
      ticketNumber: 123,
      dateCreated: '2022-07-13T18:17:01.933Z',
      phoneId: '123456789',
      state: TicketState.CREATED
    }
    await ticketsRepo.save([ticket1, ticket2, ticket3, ticket4, ticket5])
    const service = new TicketsService(ticketsRepo, servicesService, gateway)
    expect(await service.findTicketsForDevice('123456789')).toEqual(4)
  })
})
