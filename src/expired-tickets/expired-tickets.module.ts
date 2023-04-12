import { Module } from '@nestjs/common'
import { ExpiredTicketsService } from './expired-tickets.service'
import { TicketsModule } from '../tickets/tickets.module'
import { GatewayModule } from '../gateway/gateway.module'
import { OfficesModule } from '../offices/offices.module'

@Module({
  imports: [OfficesModule, TicketsModule, GatewayModule],
  controllers: [],
  providers: [ExpiredTicketsService],
  exports: [ExpiredTicketsService]
})
export class ExpiredTicketsModule {}
