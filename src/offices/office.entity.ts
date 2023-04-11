import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Organization } from '../organizations/organization.entity'
import { LENGTHS } from '../helpers/validations'
import { Service } from '../services/service.entity'
import { Counter } from '../counters/counter.entity'
import { Printer } from '../printers/printer.entity'

export enum TicketLife {
  HOURS24 = 24,
  HOURS48 = 48,
  HOURS72 = 72
}

@Entity()
export class Office {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: LENGTHS.STANDARD })
  street: string

  @Column({ length: LENGTHS.SHORT })
  block: string

  @Column({ nullable: true, default: null, length: LENGTHS.SHORT })
  building: string

  @Column({ length: LENGTHS.MEDIUM })
  city: string

  @Column({ length: LENGTHS.SHORT })
  postCode: string

  @Column({ length: 2 })
  countryCode: string

  @ManyToOne(() => Organization, (organization) => organization.offices)
  organization: Organization

  @OneToMany(() => Counter, (counter) => counter.office)
  counters: Counter[]

  @OneToMany(() => Service, (service) => service.office)
  services: Service[]

  @Column({
    type: 'enum',
    enum: TicketLife,
    default: TicketLife.HOURS24
  })
  ticketLife: TicketLife

  @OneToMany(() => Printer, (printer) => printer.office)
  printers: Printer[]
}
