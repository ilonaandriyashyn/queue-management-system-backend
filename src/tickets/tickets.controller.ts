import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateTicketDto } from './tickets.dto'
import { TicketsService } from './tickets.service'

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get(':id')
  findTicketById(@Param('id') id: string) {
    return this.ticketsService.findTicketById(id)
  }

  @Get('created/service/:id')
  getCreatedTicketsByService(@Param('id') id: string) {
    return this.ticketsService.findCreatedTicketsByService(id)
  }

  @Get('service/:id')
  getTicketsByService(@Param('id') id: string) {
    return this.ticketsService.findAllTicketsByService(id)
  }

  @Get('service/:serviceId/device/:phoneId')
  getTicketByServiceAndDevice(@Param('serviceId') serviceId: string, @Param('phoneId') phoneId: string) {
    return this.ticketsService.findTicketByServiceAndDevice(serviceId, phoneId)
  }

  @Get('device/:phoneId')
  getTicketsForDevice(@Param('phoneId') phoneId: string) {
    return this.ticketsService.findTicketsForDevice(phoneId)
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createTicket(@Body() ticket: CreateTicketDto) {
    return this.ticketsService.createTicket(ticket)
  }
}
