import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { CreateCounterDto, UpdateCounterServicesDto } from './counters.dto'
import { CountersService } from './counters.service'
import { IdParam } from '../helpers/dto'

@Controller('counters')
export class CountersController {
  constructor(private readonly countersService: CountersService) {}

  @Post('create')
  createCounter(@Body() counter: CreateCounterDto) {
    return this.countersService.createCounter(counter)
  }

  @Put(':id/services')
  updateServices(@Param() params: IdParam, @Body() data: UpdateCounterServicesDto) {
    return this.countersService.setServices(params.id, data.services)
  }

  @Put(':id/tickets/done')
  doneTicket(@Param() params: IdParam) {
    return this.countersService.doneTicket(params.id)
  }

  @Put(':id/tickets/next')
  nextTicket(@Param() params: IdParam) {
    return this.countersService.nextTicket(params.id)
  }

  @Get(':id/tickets/current')
  async getCurrentTicket(@Param() params: IdParam) {
    return await this.countersService.getCurrentTicket(params.id)
  }

  @Get(':id/tickets/created')
  async getCreatedTickets(@Param() params: IdParam) {
    return await this.countersService.findCreatedTickets(params.id)
  }
}
