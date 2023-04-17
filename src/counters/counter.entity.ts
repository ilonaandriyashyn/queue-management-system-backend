import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LENGTHS } from '../helpers/validations'
import { Service } from '../services/service.entity'
import { Office } from '../offices/office.entity'
import { Ticket } from '../tickets/ticket.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Counter {
  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ example: '1A' })
  @Column({ length: LENGTHS.SHORT })
  name: string

  @ApiProperty({
    example: {
      street: 'Thakurova',
      block: '9',
      building: 'string',
      city: 'Prague',
      postCode: '160 00',
      countryCode: 'CZ'
    }
  })
  @ManyToOne(() => Office, (office) => office.counters)
  office: Office

  @ApiProperty({ example: null })
  @ManyToMany(() => Service)
  @JoinTable()
  services: Service[]

  @ApiProperty({ example: null })
  @OneToOne(() => Ticket, (ticket) => ticket.counter, { nullable: true, onDelete: 'SET NULL', cascade: true })
  @JoinColumn()
  ticket: Ticket | null
}
