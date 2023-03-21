import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateCounterDto, UpdateCounterServicesDto } from './counters.dto'
import { CountersService } from './counters.service'

// TODO rename endpoints here to get, create etc, and in service to find

@Controller('counters')
export class CountersController {
  constructor(private readonly countersService: CountersService) {}

  // TODO do not create if name already exists for this particular office
  @Post('create')
  @UsePipes(ValidationPipe)
  createCounter(@Body() counter: CreateCounterDto) {
    return this.countersService.createCounter(counter)
  }

  @Put(':id/services')
  @UsePipes(ValidationPipe)
  updateServices(@Param('id') id: string, @Body() data: UpdateCounterServicesDto) {
    return this.countersService.setServices(id, data.services)
  }

  @Put(':id/tickets/done')
  @UsePipes(ValidationPipe)
  doneTicket(@Param('id') id: string) {
    return this.countersService.doneTicket(id)
  }

  @Put(':id/tickets/next')
  @UsePipes(ValidationPipe)
  nextTicket(@Param('id') id: string) {
    return this.countersService.nextTicket(id)
  }

  // TODO weird behavior when id is not uuid. Should just return error
  @Get(':id/tickets/current')
  @UsePipes(ValidationPipe)
  async getCurrentTicket(@Param('id') id: string) {
    return await this.countersService.getCurrentTicket(id)
  }

  @Get(':id/tickets/created')
  @UsePipes(ValidationPipe)
  async getCreatedTickets(@Param('id') id: string) {
    return await this.countersService.findCreatedTickets(id)
  }
}
