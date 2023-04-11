import { Repository } from 'typeorm'
import { setupDataSource } from '../../connection'
import { Organization } from '../organizations/organization.entity'
import { OrganizationsService } from '../organizations/organizations.service'
import { Service } from '../services/service.entity'
import { ServicesService } from '../services/services.service'
import { BadRequestException } from '@nestjs/common'
import { Office } from '../offices/office.entity'
import { Counter } from './counter.entity'
import { OfficesService } from '../offices/offices.service'
import { TicketsService } from '../tickets/tickets.service'
import { SocketGateway } from '../gateway/gateway'
import { CountersService } from './counters.service'
import { Ticket, TicketState } from '../tickets/ticket.entity'
import { MESSAGES } from '../helpers/messages'

describe('Counters service', () => {
  let countersRepo: Repository<Counter>
  let officesRepo: Repository<Office>
  let orgRepo: Repository<Organization>
  let servicesRepo: Repository<Service>
  let ticketsRepo: Repository<Ticket>
  let officesService: OfficesService
  let organizationsService: OrganizationsService
  let servicesService: ServicesService
  let ticketsService: TicketsService
  let gateway: SocketGateway

  beforeEach(async () => {
    const dataSource = await setupDataSource()
    countersRepo = dataSource.getRepository(Counter)
    officesRepo = dataSource.getRepository(Office)
    orgRepo = dataSource.getRepository(Organization)
    servicesRepo = dataSource.getRepository(Service)
    ticketsRepo = dataSource.getRepository(Ticket)
    organizationsService = new OrganizationsService(orgRepo)
    servicesService = new ServicesService(servicesRepo)
    gateway = new SocketGateway()
    ticketsService = new TicketsService(ticketsRepo, servicesService, gateway)
    officesService = new OfficesService(officesRepo, organizationsService, servicesService, ticketsService, gateway)
  })

  describe('createCounter', () => {
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
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      await expect(
        service.createCounter({ name: 'New Counter', officeId: '3f561b51-9520-43d8-b3dc-ff21a7990001' })
      ).rejects.toThrow(BadRequestException)
    })

    test('counter already exists', async () => {
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
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'New Counter',
        office
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      expect(
        await service.createCounter({ name: 'New Counter', officeId: '3f561b51-9520-43d8-b3dc-ff21a799000d' })
      ).toEqual(counter)
    })

    test('counter already exists', async () => {
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
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'New Counter',
        office
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      expect(await countersRepo.find()).toHaveLength(1)
      expect(
        await service.createCounter({ name: 'New Counter', officeId: '3f561b51-9520-43d8-b3dc-ff21a799000d' })
      ).toEqual(counter)
      expect(await countersRepo.find()).toHaveLength(1)
    })

    test('creates new counter', async () => {
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
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'New Counter 1',
        office
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      expect(await countersRepo.find()).toHaveLength(1)
      expect(
        await service.createCounter({ name: 'New Counter 2', officeId: '3f561b51-9520-43d8-b3dc-ff21a799000d' })
      ).toEqual(
        expect.objectContaining({
          name: 'New Counter 2',
          office
        })
      )
      expect(await countersRepo.find()).toHaveLength(2)
    })
  })

  describe('setServices', () => {
    test('counter is not found', async () => {
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
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1'
      }
      await countersRepo.save(counter)
      const serv = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Service 1',
        office
      }
      await servicesRepo.save(serv)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      await expect(
        service.setServices('3f561b51-9520-43d8-b3dc-ff21a7990001', ['3f561b51-9520-43d8-b3dc-ff21a7990111'])
      ).rejects.toThrow(BadRequestException)
    })

    test('sets only existing services', async () => {
      const office1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      await officesRepo.save(office1)
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        name: 'Counter 1',
        office: office1
      }
      await countersRepo.save(counter)
      const serv = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Service 1',
        office: office1
      }
      await servicesRepo.save(serv)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      expect(
        await service.setServices('3f561b51-9520-43d8-b3dc-ff21a7990001', [
          '3f561b51-9520-43d8-b3dc-ff21a7990111',
          '3f561b51-9520-43d8-b3dc-ff21a7990222'
        ])
      ).toEqual({
        ...counter,
        services: [serv]
      })
    })

    test('sets only those service that belong to counters office', async () => {
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
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        name: 'Counter 1',
        office: office1
      }
      await countersRepo.save(counter)
      const serv1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Service 1',
        office: office1
      }
      const serv2 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        name: 'Service 2',
        office: office2
      }
      await servicesRepo.save([serv1, serv2])
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      expect(
        await service.setServices('3f561b51-9520-43d8-b3dc-ff21a7990001', [
          '3f561b51-9520-43d8-b3dc-ff21a7990111',
          '3f561b51-9520-43d8-b3dc-ff21a7990222'
        ])
      ).toEqual({
        ...counter,
        services: [serv1]
      })
    })
  })

  test('findCounterById', async () => {
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
    const counter = {
      id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
      name: 'Counter 1',
      office
    }
    await countersRepo.save(counter)
    const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
    expect(await service.findCounterById('3f561b51-9520-43d8-b3dc-ff21a7990111')).toEqual(counter)
  })

  describe('doneTicket', () => {
    test('counter is not found', async () => {
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1'
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      await expect(service.doneTicket('3f561b51-9520-43d8-b3dc-ff21a7990001')).rejects.toThrow(BadRequestException)
    })

    test('counters ticket is null', async () => {
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1',
        ticket: null
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      await expect(service.doneTicket('3f561b51-9520-43d8-b3dc-ff21a7990111')).rejects.toThrow(BadRequestException)
    })

    test('counters ticket is null', async () => {
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1',
        ticket: null
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      await expect(service.doneTicket('3f561b51-9520-43d8-b3dc-ff21a7990111')).rejects.toThrow(BadRequestException)
    })

    test('ticket is in created state', async () => {
      const ticket = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:46:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED
      }
      await ticketsRepo.save(ticket)
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1',
        ticket
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      await expect(service.doneTicket('3f561b51-9520-43d8-b3dc-ff21a7990111')).rejects.toThrow(BadRequestException)
    })

    test('deletes ticket', async () => {
      const office1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      await officesRepo.save(office1)
      const serv1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Service 1',
        office: office1
      }
      await servicesRepo.save(serv1)
      const ticket = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:46:01.933Z',
        phoneId: '123456789',
        state: TicketState.PROCESSING,
        service: serv1
      }
      await ticketsRepo.save(ticket)
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1',
        ticket
      }
      await countersRepo.save(counter)
      gateway = new SocketGateway()
      const emit = jest.fn()
      // @ts-expect-error no need to mock everything
      gateway.server = {
        emit
      }
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      expect(await service.doneTicket('3f561b51-9520-43d8-b3dc-ff21a7990111')).toEqual({ affected: 1, raw: [] })
      expect(emit).toHaveBeenCalledWith(
        `${MESSAGES.ON_DONE_TICKET}/${counter.ticket.service.id}`,
        '3f561b51-9520-43d8-b3dc-ff21a7990222'
      )
    })
  })

  describe('nextTicket', () => {
    test('counter is not found', async () => {
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1'
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      await expect(service.nextTicket('3f561b51-9520-43d8-b3dc-ff21a7990001')).rejects.toThrow(BadRequestException)
    })

    test('counters ticket is not null', async () => {
      const ticket = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:46:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED
      }
      await ticketsRepo.save(ticket)
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1',
        ticket
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      await expect(service.nextTicket('3f561b51-9520-43d8-b3dc-ff21a7990111')).rejects.toThrow(BadRequestException)
    })

    test('returns next ticket', async () => {
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
        id: '3f561b51-9520-43d8-b3dc-ff21a7990555',
        name: 'Service 1'
      }
      const serv2 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990556',
        name: 'Service 2'
      }
      const serv3 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990557',
        name: 'Service 3'
      }
      await servicesRepo.save([serv1, serv2, serv3])
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1',
        ticket: null,
        office,
        services: [serv1, serv2]
      }
      await countersRepo.save(counter)
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
        service: serv2
      }
      const ticket3 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990224',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:18:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv3
      }
      const ticket4 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990225',
        ticketNumber: 123,
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
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      expect(await service.nextTicket('3f561b51-9520-43d8-b3dc-ff21a7990111')).toEqual(
        expect.objectContaining({
          ...ticket4,
          state: TicketState.PROCESSING
        })
      )
      expect(emit).toHaveBeenCalledWith(
        `${MESSAGES.ON_UPDATE_QUEUE}/${counter.office.id}/${ticket4.service.id}`,
        expect.objectContaining({
          ...ticket4,
          state: TicketState.PROCESSING,
          counter: {
            id: counter.id,
            name: counter.name
          }
        })
      )
    })

    test('no next ticket', async () => {
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
        id: '3f561b51-9520-43d8-b3dc-ff21a7990555',
        name: 'Service 1'
      }
      const serv2 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990556',
        name: 'Service 2'
      }
      const serv3 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990557',
        name: 'Service 3'
      }
      await servicesRepo.save([serv1, serv2, serv3])
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1',
        ticket: null,
        office,
        services: [serv1, serv2]
      }
      await countersRepo.save(counter)
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
        state: TicketState.PROCESSING,
        service: serv2
      }
      const ticket3 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990224',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:18:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv3
      }
      await ticketsRepo.save([ticket1, ticket2, ticket3])
      gateway = new SocketGateway()
      const emit = jest.fn()
      // @ts-expect-error no need to mock everything
      gateway.server = {
        emit
      }
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      expect(await service.nextTicket('3f561b51-9520-43d8-b3dc-ff21a7990111')).toEqual(null)
      expect(emit).not.toHaveBeenCalled()
    })
  })

  describe('getCurrentTicket', () => {
    test('counter is not found', async () => {
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1'
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      await expect(service.getCurrentTicket('3f561b51-9520-43d8-b3dc-ff21a7990001')).rejects.toThrow(
        BadRequestException
      )
    })

    test('returns ticket', async () => {
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
      const serv = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990555',
        name: 'Service 1'
      }
      await servicesRepo.save([serv])
      const ticket = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990222',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:16:01.933Z',
        phoneId: '123456789',
        state: TicketState.PROCESSING,
        service: serv
      }
      await ticketsRepo.save(ticket)
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1',
        ticket,
        office,
        services: [serv]
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      expect(await service.getCurrentTicket('3f561b51-9520-43d8-b3dc-ff21a7990111')).toEqual(ticket)
    })
  })

  describe('findCreatedTickets', () => {
    test('counter is not found', async () => {
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1'
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      await expect(service.findCreatedTickets('3f561b51-9520-43d8-b3dc-ff21a7990001')).rejects.toThrow(
        BadRequestException
      )
    })

    test('returns tickets', async () => {
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
        id: '3f561b51-9520-43d8-b3dc-ff21a7990555',
        name: 'Service 1'
      }
      const serv2 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990556',
        name: 'Service 2'
      }
      const serv3 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990557',
        name: 'Service 3'
      }
      await servicesRepo.save([serv1, serv2, serv3])
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
        dateCreated: '2022-07-13T18:15:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv2
      }
      const ticket3 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990224',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:16:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv3
      }
      const ticket4 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990225',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:14:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv1
      }
      const ticket5 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990226',
        ticketNumber: 123,
        dateCreated: '2022-07-13T18:01:01.933Z',
        phoneId: '123456789',
        state: TicketState.CREATED,
        service: serv1
      }
      await ticketsRepo.save([ticket1, ticket2, ticket3, ticket4, ticket5])
      const counter = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Counter 1',
        office,
        services: [serv1, serv2]
      }
      await countersRepo.save(counter)
      const service = new CountersService(countersRepo, officesService, servicesService, ticketsService, gateway)
      expect(await service.findCreatedTickets('3f561b51-9520-43d8-b3dc-ff21a7990111')).toEqual([
        ticket5,
        ticket4,
        ticket2
      ])
    })
  })
})
