import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { LENGTHS } from '../helpers/validations'
import { Office } from '../offices/office.entity'
import { Ticket } from '../tickets/ticket.entity'

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: LENGTHS.STANDARD })
  name: string

  @ManyToOne(() => Office, (office) => office.services)
  office: Office

  @OneToMany(() => Ticket, (ticket) => ticket.service)
  tickets: Ticket[]
}
