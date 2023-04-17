import { IsArray, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'
import { LENGTHS } from '../helpers/validations'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCounterDto {
  @ApiProperty({ example: '1A' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.SHORT)
  name: string

  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @IsNotEmpty()
  @IsUUID()
  officeId: string
}

export class UpdateCounterServicesDto {
  @ApiProperty({ example: ['XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY'] })
  // uuid of services
  @IsArray()
  services: string[]
}
