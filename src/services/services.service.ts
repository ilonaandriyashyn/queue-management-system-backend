import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Service } from './service.entity'
import { Repository } from 'typeorm'
import { CreateServiceDto } from '../offices/offices.dto'
import { Office } from '../offices/office.entity'

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>
  ) {}

  async findServiceById(id: string) {
    return this.servicesRepository.findOneBy({ id })
  }

  async findServiceByIdWithOffice(id: string) {
    return this.servicesRepository.findOne({ relations: ['office', 'office.organization'], where: { id } })
  }

  // TODO maybe it is enough to just get it by office id
  async findServices(organizationId: string, officeId: string) {
    return this.servicesRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.office', 'office')
      .leftJoinAndSelect('office.organization', 'organization')
      .where('office.id=:officeId', { officeId })
      .andWhere('organization.id=:organizationId', { organizationId })
      .getMany()
  }

  async createService(office: Office, service: CreateServiceDto) {
    const newService = this.servicesRepository.create({
      name: service.name,
      office
    })
    return this.servicesRepository.save(newService)
  }
}
