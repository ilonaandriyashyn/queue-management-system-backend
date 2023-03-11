import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: false,
    default: ''
  })
  name: string
}
