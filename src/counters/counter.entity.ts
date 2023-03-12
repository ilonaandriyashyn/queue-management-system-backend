import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LENGTHS } from '../helpers/validations'
import { Service } from '../services/service.entity'
import { Office } from '../offices/office.entity'

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
}
