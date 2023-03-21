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

  @Get('service/:id')
  getTicketsByService(@Param('id') id: string) {
    return this.ticketsService.findAllTicketsByService(id)
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createTicket(@Body() ticket: CreateTicketDto) {
    return this.ticketsService.createTicket(ticket)
  }
}
