import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateOfficeDto, CreateServiceDto, UpdateOfficeServicesDto } from './offices.dto'
import { OfficesService } from './offices.service'

@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  getOffices() {
    return this.officesService.findOffices()
  }

  @Get(':id')
  findOfficeById(@Param('id') id: string) {
    return this.officesService.findOfficeById(id)
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createOffice(@Body() office: CreateOfficeDto) {
    return this.officesService.createOffice(office)
  }

  @Get(':id/services')
  getOfficeServices(@Param('id') id: string) {
    return this.officesService.findOfficeServices(id)
  }

  @Put(':id/services')
  @UsePipes(ValidationPipe)
  updateServices(@Param('id') id: string, @Body() data: UpdateOfficeServicesDto) {
    return this.officesService.setServices(id, data.services)
  }

  @Post(':id/services/create')
  @UsePipes(ValidationPipe)
  createService(@Param('id') id: string, @Body() service: CreateServiceDto) {
    return this.officesService.createService(id, service)
  }
}
