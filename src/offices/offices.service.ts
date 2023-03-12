import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Office } from './office.entity'
import { Repository } from 'typeorm'
import { CreateOfficeDto } from './offices.dto'
import { OrganizationsService } from '../organizations/organizations.service'

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private readonly officesRepository: Repository<Office>,
    private readonly organizationsService: OrganizationsService
  ) {}

  findOffices() {
    return this.officesRepository.find({ relations: ['counters', 'counters.services', 'services'] })
  }

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
}
