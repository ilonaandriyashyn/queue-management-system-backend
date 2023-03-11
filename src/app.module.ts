import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OrganizationsModule } from './organizations/organizations.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    OrganizationsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'queue',
      synchronize: true, // Turn this off in production
      autoLoadEntities: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
