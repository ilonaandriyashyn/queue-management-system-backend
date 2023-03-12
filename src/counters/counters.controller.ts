import { Body, Controller, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateCounterDto, UpdateCounterServicesDto } from './counters.dto'
import { CountersService } from './counters.service'

@Controller('counters')
export class CountersController {
  constructor(private readonly countersService: CountersService) {}

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
}
