import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Office } from '../offices/office.entity'

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 500 })
  name: string

  @OneToMany(() => Office, (office) => office.organization)
  offices: Office[]
}
