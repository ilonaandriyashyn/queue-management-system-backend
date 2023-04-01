import { DataSource, Repository } from 'typeorm'
import { Organization } from './organization.entity'
import { OrganizationsService } from './organizations.service'
import { setupDataSource } from '../../connection'
import { Office } from '../offices/office.entity'

describe('Organizations service', () => {
  let dataSource: DataSource
  let repo: Repository<Organization>

  beforeEach(async () => {
    dataSource = await setupDataSource()
    repo = dataSource.getRepository(Organization)
  })

  test('findOrganizations', async () => {
    await repo.save([
      {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        name: 'Org 1'
      },
      {
        id: '3f561b51-9520-43d8-b3dc-ff21a799001d',
        name: 'Org 2'
      }
    ])
    const organizationsService = new OrganizationsService(repo)
    expect(await organizationsService.findOrganizations()).toEqual([
      {
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        name: 'Org 1'
      },
      {
        id: '3f561b51-9520-43d8-b3dc-ff21a799001d',
        name: 'Org 2'
      }
    ])
  })

  test('createOrganization', async () => {
    const organizationsService = new OrganizationsService(repo)
    const newOrg = await organizationsService.createOrganization({ name: 'New Organization' })
    expect(newOrg.id).not.toBeNull()
    expect(newOrg.name).toEqual('New Organization')
  })

  describe('findOrganizationById', () => {
    test('does not find organization', async () => {
      await repo.save([
        {
          id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
          name: 'Org 1'
        }
      ])
      const organizationsService = new OrganizationsService(repo)
      expect(await organizationsService.findOrganizationById('3f561b51-9520-43d8-b3dc-ff21a7990001')).toEqual(null)
    })

    test('finds organization', async () => {
      await repo.save([
        {
          id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
          name: 'Org 1'
        }
      ])
      const organizationsService = new OrganizationsService(repo)
      expect(await organizationsService.findOrganizationById('3f561b51-9520-43d8-b3dc-ff21a799000d')).toEqual({
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        name: 'Org 1'
      })
    })
  })

  describe('findOrganizationOffices', () => {
    test('does not find organization', async () => {
      const officeRepo = dataSource.getRepository(Office)
      const org = await repo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        name: 'Org 1'
      })
      await repo.save(org)
      const office = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        city: 'Prague',
        street: 'Karlova',
        country: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      await officeRepo.save({ ...office, organization: org })
      const organizationsService = new OrganizationsService(repo)
      expect(await organizationsService.findOrganizationOffices('3f561b51-9520-43d8-b3dc-ff21a7990021')).toEqual([])
    })

    test('finds organization', async () => {
      const officeRepo = dataSource.getRepository(Office)
      const org = await repo.create({
        id: '3f561b51-9520-43d8-b3dc-ff21a799000d',
        name: 'Org 1'
      })
      await repo.save(org)
      const office = {
        id: '3f561b51-9520-43d8-b3dc-ff21a7990001',
        city: 'Prague',
        street: 'Karlova',
        country: 'cz',
        postCode: '13400',
        building: '123',
        block: '111'
      }
      await officeRepo.save({ ...office, organization: org })
      const organizationsService = new OrganizationsService(repo)
      expect(await organizationsService.findOrganizationOffices('3f561b51-9520-43d8-b3dc-ff21a799000d')).toEqual([
        office
      ])
    })
  })
})
