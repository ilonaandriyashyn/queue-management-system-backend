import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Office } from '../offices/office.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Organization {
  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ example: 'Organization 1' })
  @Column({ length: 500 })
  name: string

  @ApiProperty({
    example: [
      {
        street: 'Thakurova',
        block: '9',
        building: 'string',
        city: 'Prague',
        postCode: '160 00',
        countryCode: 'CZ'
      }
    ]
  })
  @OneToMany(() => Office, (office) => office.organization)
  offices: Office[]
}
