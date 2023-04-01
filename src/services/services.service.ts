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
    return this.servicesRepository.findOne({ relations: ['office'], where: { id } })
  }

  async findServiceByIdWithOffice(id: string) {
    return this.servicesRepository.findOne({
      relations: ['office', 'office.organization', 'office.services'],
      where: { id }
    })
  }

  async createService(office: Office, service: CreateServiceDto) {
    const newService = this.servicesRepository.create({
      name: service.name,
      office
    })
    return this.servicesRepository.save(newService)
  }
}
