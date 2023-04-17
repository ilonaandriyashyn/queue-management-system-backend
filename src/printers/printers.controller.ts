import { Body, Controller, Post } from '@nestjs/common'
import { PrintersService } from './printers.service'
import { CreatePrinterDto } from './printers.dto'

@Controller('printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @Post('create')
  createPrinter(@Body() printer: CreatePrinterDto) {
    return this.printersService.createPrinter(printer.officeId)
  }
}
