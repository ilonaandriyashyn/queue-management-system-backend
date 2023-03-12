import { Module } from '@nestjs/common'
import { ServicesController } from './services.controller'
import { ServicesService } from './services.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Service } from './service.entity'
import { OfficesModule } from '../offices/offices.module'

@Module({
  imports: [TypeOrmModule.forFeature([Service]), OfficesModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService]
})
export class ServicesModule {}
