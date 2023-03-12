import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LENGTHS } from '../helpers/validations'
import { Office } from '../offices/office.entity'

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: LENGTHS.STANDARD })
  name: string

  @ManyToOne(() => Office, (office) => office.services)
  office: Office
}
