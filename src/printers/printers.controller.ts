import { Controller, Post } from '@nestjs/common'
import { PrintersService } from './printers.service'

@Controller('printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @Post('create')
  createTicket() {
    return this.printersService.createPrinter()
  }
}
