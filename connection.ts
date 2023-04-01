import { DataSource } from 'typeorm'
import { newDb, DataType } from 'pg-mem'
import { v4 } from 'uuid'
import { Office } from './src/offices/office.entity'
import { Organization } from './src/organizations/organization.entity'
import { Service } from './src/services/service.entity'
import { Ticket } from './src/tickets/ticket.entity'
import { Counter } from './src/counters/counter.entity'

export const setupDataSource = async () => {
  const db = newDb({
    autoCreateForeignKeyIndices: true
  })

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database'
  })

  db.public.registerFunction({
    implementation: () =>
      ' PostgreSQL 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 11.3.0-1ubuntu1~22.04) 11.3.0, 64-bit',
    name: 'version'
  })

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: v4,
      impure: true
    })
  })

  const ds: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [Office, Organization, Service, Ticket, Counter]
  })
  await ds.initialize()
  await ds.synchronize()

  return ds
}
