import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common'
import {
  CreateTicketDto,
  CreateTicketFromPrinterDto,
  CreateTicketFromPrinterHeadersDto,
  PhoneIdParam,
  ServiceAndDeviceParams
} from './tickets.dto'
import { TicketsService } from './tickets.service'
import { IdParam } from '../helpers/dto'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get(':id')
  findTicketById(@Param() params: IdParam) {
    return this.ticketsService.findTicketById(params.id)
  }

  @Get('created/service/:id')
  getCreatedTicketsByService(@Param() params: IdParam) {
    return this.ticketsService.findCreatedTicketsByServices([params.id])
  }

  @Get('service/:id')
  getTicketsByService(@Param() params: IdParam) {
    return this.ticketsService.findAllTicketsByService(params.id)
  }

  @Get('service/:serviceId/device/:phoneId')
  getTicketByServiceAndDevice(@Param() params: ServiceAndDeviceParams) {
    return this.ticketsService.findTicketByServiceAndDevice(params.serviceId, params.phoneId)
  }

  @Get('device/:phoneId')
  getTicketsCountForDevice(@Param() params: PhoneIdParam) {
    return this.ticketsService.findTicketsForDevice(params.phoneId)
  }

  @Post('create')
  createTicket(@Body() ticket: CreateTicketDto) {
    return this.ticketsService.createTicket(ticket)
  }

  @ApiHeader({
    name: 'authorization',
    description: "Printer's key"
  })
  @Post('printer/create')
  createTicketFromPrinter(
    @Headers() headers: CreateTicketFromPrinterHeadersDto,
    @Body() ticket: CreateTicketFromPrinterDto
  ) {
    return this.ticketsService.createTicketFromPrinter(headers.authorization, ticket.serviceId)
  }
}
