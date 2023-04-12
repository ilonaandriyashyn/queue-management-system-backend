import { Repository } from 'typeorm'
import { setupDataSource } from '../../connection'
import { Office, TicketLife } from './office.entity'
import { OfficesService } from './offices.service'
import { Organization } from '../organizations/organization.entity'
import { OrganizationsService } from '../organizations/organizations.service'
import { Service } from '../services/service.entity'
import { ServicesService } from '../services/services.service'
import { BadRequestException } from '@nestjs/common'

describe('Offices service', () => {
  let officesRepo: Repository<Office>
  let orgRepo: Repository<Organization>
  let servicesRepo: Repository<Service>
  let organizationsService: OrganizationsService
  let servicesService: ServicesService

  beforeEach(async () => {
    const dataSource = await setupDataSource()
    officesRepo = dataSource.getRepository(Office)
    orgRepo = dataSource.getRepository(Organization)
    servicesRepo = dataSource.getRepository(Service)
    organizationsService = new OrganizationsService(orgRepo)
    servicesService = new ServicesService(servicesRepo)
  })

  describe('createOffice', () => {
    test('organization is not found', async () => {
      const office = {
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111',
        organizationId: '3f561b51-9520-43d8-b3dc-ff21a799000d'
      }
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      await expect(service.createOffice(office)).rejects.toThrow(BadRequestException)
    })

    test('creates office', async () => {
      const organization = {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        name: 'Org 1'
      }
      const organizationId = '3f561b51-9520-43d8-b3dc-ff21a799000d'
      const office = {
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      await orgRepo.save(organization)
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      expect(await service.createOffice({ ...office, organizationId })).toEqual(
        expect.objectContaining({
          ...office,
          organization
        })
      )
    })
  })

  describe('findOfficeById', () => {
    test('office is not found', async () => {
      const org = await orgRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        name: 'Org 1'
      })
      await orgRepo.save(org)
      const office = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      await officesRepo.save({ ...office, organization: org })
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      expect(await service.findOfficeById('3f561b51-9520-43d8-b3dc-ff21a799000d')).toEqual(null)
    })

    test('office is found', async () => {
      const org = await orgRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        name: 'Org 1'
      })
      await orgRepo.save(org)
      const office = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111',
        ticketLife: TicketLife.HOURS24
      }
      await officesRepo.save({ ...office, organization: org })
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      expect(await service.findOfficeById('3f561b51-9520-43d8-b3dc-ff21a7990001')).toEqual(office)
    })
  })

  describe('findOfficeServices', () => {
    test('office is not found', async () => {
      const org = await orgRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        name: 'Org 1'
      })
      await orgRepo.save(org)
      const office1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      await officesRepo.save({ ...office1, organization: org })
      const serv1 = await servicesRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799111d',
        name: 'Service 1'
      })
      await servicesRepo.save({ ...serv1, office: { ...office1, organization: org } })
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      await expect(service.findOfficeServices('3f561b51-9520-43d8-b3dc-ff21a7990031')).rejects.toThrow(
        BadRequestException
      )
    })

    test('finds services', async () => {
      const org = await orgRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        name: 'Org 1'
      })
      await orgRepo.save(org)
      const office1 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      const office2 = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990002',
        city: 'Prague',
        street: 'Karlova',
        countryCode: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      await officesRepo.save([
        { ...office1, organization: org },
        { ...office2, organization: org }
      ])
      const serv1 = await servicesRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799111d',
        name: 'Service 1'
      })
      const serv2 = await servicesRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799222d',
        name: 'Service 2'
      })
      await servicesRepo.save([
        { ...serv1, office: { ...office1, organization: org } },
        { ...serv2, office: { ...office2, organization: org } }
      ])
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      expect(await service.findOfficeServices('3f561b51-9520-43d8-b3dc-ff21a7990001')).toEqual([serv1])
    })
  })

  describe('createService', () => {
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
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      await expect(
        service.createService('3f561b51-9520-43d8-b3dc-ff21a7990001', { name: 'New Service' })
      ).rejects.toThrow(BadRequestException)
    })

    test('creates service', async () => {
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
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      expect(await service.createService('3f561b51-9520-43d8-b3dc-ff21a799000d', { name: 'New Service' })).toEqual(
        expect.objectContaining({
          name: 'New Service',
          office
        })
      )
    })
  })

  describe('setServices', () => {
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
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      await expect(
        service.setServices('3f561b51-9520-43d8-b3dc-ff21a7990001', [
          '3f561b51-9520-43d8-b3dc-ff21a7990111',
          '3f561b51-9520-43d8-b3dc-ff21a7990222'
        ])
      ).rejects.toThrow(BadRequestException)
    })

    test('empty services', async () => {
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
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      expect(await service.setServices('3f561b51-9520-43d8-b3dc-ff21a799000d', [])).toEqual({ ...office, services: [] })
    })

    test('service id is not uuid', async () => {
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
      const serv1 = await servicesRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799111d',
        name: 'Service 1'
      })
      const serv2 = await servicesRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Service 2'
      })
      await servicesRepo.save([
        { ...serv1, office },
        { ...serv2, office }
      ])
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      await expect(
        service.setServices('3f561b51-9520-43d8-b3dc-ff21a799000d', ['3f5', '3f561b51-9520-43d8-b3dc-ff21a7990222'])
      ).rejects.toThrow(BadRequestException)
    })

    test('sets existing services', async () => {
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
      const serv1 = await servicesRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799111d',
        name: 'Service 1'
      })
      const serv2 = await servicesRepo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a7990111',
        name: 'Service 2'
      })
      await servicesRepo.save([
        { ...serv1, office },
        { ...serv2, office }
      ])
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      expect(
        await service.setServices('3f561b51-9520-43d8-b3dc-ff21a799000d', [
          '3f561b51-9520-43d8-b3dc-ff21a7990111',
          '3f561b51-9520-43d8-b3dc-ff21a7990222'
        ])
      ).toEqual({ ...office, services: [{ ...serv2, office }] })
    })
  })

  describe('updateTicketLife', () => {
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
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      await expect(
        service.updateTicketLife('3f561b51-9520-43d8-b3dc-ff21a7990001', TicketLife.HOURS48)
      ).rejects.toThrow(BadRequestException)
    })

    test('updates ticket life', async () => {
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
      await officesRepo.save(office)
      const service = new OfficesService(officesRepo, organizationsService, servicesService)
      expect(await service.updateTicketLife('3f561b51-9520-43d8-b3dc-ff21a799000d', TicketLife.HOURS48)).toEqual({
        ...office,
        ticketLife: TicketLife.HOURS48
      })
    })
  })
})
