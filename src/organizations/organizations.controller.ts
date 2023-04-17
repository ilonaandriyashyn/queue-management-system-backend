import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'
import { CreateOrganizationDto } from './organizations.dto'
import { IdParam } from '../helpers/dto'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Organization } from './organization.entity'

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiOkResponse({ type: Organization, isArray: true })
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
