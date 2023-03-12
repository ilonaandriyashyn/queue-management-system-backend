import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateServiceDto } from './services.dto'
import { ServicesService } from './services.service'

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get(':id')
  findOfficeById(@Param('id') id: string) {
    return this.servicesService.findServiceById(id)
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createOffice(@Body() service: CreateServiceDto) {
    return this.servicesService.createService(service)
  }
}
