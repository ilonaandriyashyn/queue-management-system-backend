import { Module } from '@nestjs/common'
import { OfficesController } from './offices.controller'
import { OfficesService } from './offices.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Office } from './office.entity'
import { OrganizationsModule } from '../organizations/organizations.module'

@Module({
  imports: [TypeOrmModule.forFeature([Office]), OrganizationsModule],
  controllers: [OfficesController],
  providers: [OfficesService],
  exports: [OfficesService]
})
export class OfficesModule {}
