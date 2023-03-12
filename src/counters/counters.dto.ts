import { IsArray, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'
import { LENGTHS } from '../helpers/validations'

export class CreateCounterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.SHORT)
  name: string

  @IsNotEmpty()
  @IsUUID()
  officeId: string
}

export class UpdateCounterServicesDto {
  // uuid of services
  @IsArray()
  services: string[]
}
