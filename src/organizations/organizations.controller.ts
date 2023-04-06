import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'
import { CreateOrganizationDto } from './organizations.dto'
import { IdParam } from '../helpers/dto'

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  getOrganizations() {
    return this.organizationsService.findOrganizations()
  }

  @Get(':id')
  getOrganizationById(@Param() params: IdParam) {
    return this.organizationsService.findOrganizationById(params.id)
  }

  @Get(':id/offices')
  getOrganizationsOffices(@Param() params: IdParam) {
    return this.organizationsService.findOrganizationOffices(params.id)
  }

  @Post('create')
  createOrganization(@Body() organization: CreateOrganizationDto) {
    return this.organizationsService.createOrganization(organization)
  }
}
