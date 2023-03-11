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

  async findOrganizationById(id: number) {
    return this.organizationsRepository.findOneBy({ id })
  }
}
