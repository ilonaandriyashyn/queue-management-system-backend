import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'
import { CreateOrganizationDto } from './organizations.dto'

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  getOrganizations() {
    return this.organizationsService.getOrganizations()
  }

  @Get(':id')
  getOrganizationById(@Param('id') id: string) {
    return this.organizationsService.findOrganizationById(id)
  }

  @Get(':id/offices')
  getOrganizationsOffices(@Param('id') id: string) {
    return this.organizationsService.findOrganizationOffices(id)
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createOrganization(@Body() organization: CreateOrganizationDto) {
    return this.organizationsService.createOrganization(organization)
  }
}
