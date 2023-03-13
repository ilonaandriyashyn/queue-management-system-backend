import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LENGTHS } from '../helpers/validations'
import { Service } from '../services/service.entity'

export enum TicketState {
  CREATED = 'created',
  PROCESSING = 'processing'
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // TODO maybe it will be a number IMEI
  @Column({ length: LENGTHS.MEDIUM })
  phoneId: string

  @Column({
    type: 'enum',
    enum: TicketState,
    default: TicketState.CREATED
  })
  state: TicketState

  @ManyToOne(() => Service, (service) => service.tickets)
  service: Service
}
