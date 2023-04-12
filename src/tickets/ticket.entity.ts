import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LENGTHS } from '../helpers/validations'
import { Service } from '../services/service.entity'
import { Counter } from '../counters/counter.entity'

export enum TicketState {
  CREATED = 'created',
  PROCESSING = 'processing'
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  ticketNumber: number

  @Index()
  @CreateDateColumn()
  dateCreated: Date

  @Column({ nullable: true, length: LENGTHS.MEDIUM })
  phoneId: string

  @Column({
    type: 'enum',
    enum: TicketState,
    default: TicketState.CREATED
  })
  state: TicketState

  @ManyToOne(() => Service, (service) => service.tickets)
  service: Service

  @OneToOne(() => Counter, (counter) => counter.ticket, { nullable: true })
  counter: Counter
}
