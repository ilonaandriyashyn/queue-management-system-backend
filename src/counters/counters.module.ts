import { Module } from '@nestjs/common'
import { CountersController } from './counters.controller'
import { CountersService } from './counters.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Counter } from './counter.entity'
import { OfficesModule } from '../offices/offices.module'
import { ServicesModule } from '../services/services.module'

@Module({
  imports: [TypeOrmModule.forFeature([Counter]), OfficesModule, ServicesModule],
  controllers: [CountersController],
  providers: [CountersService],
  exports: [CountersService]
})
export class CountersModule {}
