import { Module } from '@nestjs/common'
import { TicketsController } from './tickets.controller'
import { TicketsService } from './tickets.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Ticket } from './ticket.entity'
import { ServicesModule } from '../services/services.module'

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), ServicesModule],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService]
})
export class TicketsModule {}
