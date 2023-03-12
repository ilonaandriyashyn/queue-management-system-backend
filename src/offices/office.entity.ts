import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Organization } from '../organizations/organization.entity'
import { LENGTHS } from '../helpers/validations'
import { Service } from '../services/service.entity'
import { Counter } from '../counters/counter.entity'

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

  @Column({ length: LENGTHS.MEDIUM })
  country: string

  @ManyToOne(() => Organization, (organization) => organization.offices)
  organization: Organization

  @OneToMany(() => Counter, (counter) => counter.office)
  counters: Counter[]

  @OneToMany(() => Service, (service) => service.office)
  services: Service[]
}
