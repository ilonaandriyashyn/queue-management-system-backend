import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OrganizationsModule } from './organizations/organizations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OfficesModule } from './offices/offices.module'
import { ServicesModule } from './services/services.module'
import { TicketsModule } from './tickets/tickets.module'
import { CountersModule } from './counters/counters.module'
import { GatewayModule } from './gateway/gateway.module'
import { ScheduleModule } from '@nestjs/schedule'
import { DevtoolsModule } from '@nestjs/devtools-integration'
import { PrintersModule } from './printers/printers.module'

@Module({
  imports: [
    OrganizationsModule,
    OfficesModule,
    ServicesModule,
    CountersModule,
    TicketsModule,
    GatewayModule,
    PrintersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'queue',
      synchronize: true, // Turn this off in production
      autoLoadEntities: true
    }),
    ScheduleModule.forRoot(),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production'
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
