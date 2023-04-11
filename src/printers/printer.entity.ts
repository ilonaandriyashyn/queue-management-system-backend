import { Column, Entity, Generated, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Office } from '../offices/office.entity'

@Entity()
export class Printer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Generated('uuid')
  key: string

  @ManyToOne(() => Office, (office) => office.printers)
  office: Office
}
