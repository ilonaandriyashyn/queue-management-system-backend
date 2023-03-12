import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateOfficeDto } from './offices.dto'
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
}
