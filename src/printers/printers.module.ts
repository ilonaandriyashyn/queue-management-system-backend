import { Module } from '@nestjs/common'
import { PrintersController } from './printers.controller'
import { PrintersService } from './printers.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Printer } from './printer.entity'
import { OfficesModule } from '../offices/offices.module'

@Module({
  imports: [TypeOrmModule.forFeature([Printer]), OfficesModule],
  controllers: [PrintersController],
  providers: [PrintersService],
  exports: [PrintersService]
})
export class PrintersModule {}
