import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Office } from './office.entity'
import { Repository } from 'typeorm'
import { CreateOfficeDto, CreateServiceDto } from './offices.dto'
import { OrganizationsService } from '../organizations/organizations.service'
import { ServicesService } from '../services/services.service'
import { Service } from '../services/service.entity'

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private readonly officesRepository: Repository<Office>,
    private readonly organizationsService: OrganizationsService,
    private readonly servicesService: ServicesService
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
      country: office.country,
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
}
