import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { CreateOfficeDto, CreateServiceDto, UpdateOfficeServicesDto } from './offices.dto'
import { OfficesService } from './offices.service'
import { TicketLife } from './office.entity'
import { IdParam } from '../helpers/dto'

@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get(':id')
  getOfficeById(@Param() params: IdParam) {
    return this.officesService.findOfficeById(params.id)
  }

  @Post('create')
  createOffice(@Body() office: CreateOfficeDto) {
    return this.officesService.createOffice(office)
  }

  @Get(':id/services')
  getOfficeServices(@Param() params: IdParam) {
    return this.officesService.findOfficeServices(params.id)
  }

  @Put(':id/services')
  updateServices(@Param() params: IdParam, @Body() data: UpdateOfficeServicesDto) {
    return this.officesService.setServices(params.id, data.services)
  }

  @Post(':id/services/create')
  createService(@Param() params: IdParam, @Body() service: CreateServiceDto) {
    return this.officesService.createService(params.id, service)
  }

  @Put(':id/ticket-life')
  updateTicketLife(@Param() params: IdParam, @Body() body: { ticketLife: TicketLife }) {
    return this.officesService.updateTicketLife(params.id, body.ticketLife)
  }
}
