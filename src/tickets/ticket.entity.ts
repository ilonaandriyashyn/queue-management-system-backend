import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LENGTHS } from '../helpers/validations'
import { Service } from '../services/service.entity'

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // TODO maybe it will be a number IMEI
  @Column({ length: LENGTHS.MEDIUM })
  phoneId: string

  @ManyToOne(() => Service, (service) => service.tickets)
  service: Service
}
