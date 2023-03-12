import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Organization } from './organization.entity'
import { Repository } from 'typeorm'
import { CreateOrganizationDto } from './organizations.dto'

@Injectable()
export class OrganizationsService {
  constructor(@InjectRepository(Organization) private readonly organizationsRepository: Repository<Organization>) {}

  getOrganizations() {
    return this.organizationsRepository.find()
  }

  createOrganization(createOrganizationDto: CreateOrganizationDto) {
    const newOrganization = this.organizationsRepository.create(createOrganizationDto)
    return this.organizationsRepository.save(newOrganization)
  }

  // TODO needs to be async?
  async findOrganizationById(id: string) {
    return this.organizationsRepository.findOneBy({ id })
  }
}
