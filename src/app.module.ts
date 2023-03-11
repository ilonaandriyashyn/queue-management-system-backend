import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OrganizationsModule } from './organizations/organizations.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), OrganizationsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
