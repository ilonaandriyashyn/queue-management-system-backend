import { Body, Controller, Post } from '@nestjs/common'
import { PrintersService } from './printers.service'
import { CreatePrinterDto } from './printers.dto'
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('printers')
@Controller('printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @ApiCreatedResponse()
  @ApiCreatedResponse({ description: 'The record has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Office is not found.' })
  @Post('create')
  createPrinter(@Body() printer: CreatePrinterDto) {
    return this.printersService.createPrinter(printer.officeId)
  }
}
