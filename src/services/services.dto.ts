import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'
import { LENGTHS } from '../helpers/validations'

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.STANDARD)
  name: string

  @IsNotEmpty()
  @IsUUID()
  officeId: string
}
