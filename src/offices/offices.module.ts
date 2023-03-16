import { forwardRef, Module } from '@nestjs/common'
import { OfficesController } from './offices.controller'
import { OfficesService } from './offices.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Office } from './office.entity'
import { OrganizationsModule } from '../organizations/organizations.module'
import { ServicesModule } from '../services/services.module'

@Module({
  imports: [TypeOrmModule.forFeature([Office]), OrganizationsModule, forwardRef(() => ServicesModule)],
  controllers: [OfficesController],
  providers: [OfficesService],
  exports: [OfficesService]
})
export class OfficesModule {}
