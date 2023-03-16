import { Controller, Get, Param, Query } from '@nestjs/common'
import { GetServicesDto } from './services.dto'
import { ServicesService } from './services.service'

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findServices(@Query() query: GetServicesDto) {
    return this.servicesService.findServices(query.organizationId, query.officeId)
  }

  @Get(':id')
  findServiceById(@Param('id') id: string) {
    return this.servicesService.findServiceById(id)
  }
}
