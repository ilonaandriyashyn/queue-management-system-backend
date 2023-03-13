import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LENGTHS } from '../helpers/validations'
import { Service } from '../services/service.entity'
import { Office } from '../offices/office.entity'
import { Ticket } from '../tickets/ticket.entity'

@Entity()
export class Counter {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: LENGTHS.SHORT })
  name: string

  @ManyToOne(() => Office, (office) => office.counters)
  office: Office

  @ManyToMany(() => Service)
  @JoinTable()
  services: Service[]

  @OneToOne(() => Ticket, (ticket) => ticket.counter, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  ticket: Ticket | null
}
