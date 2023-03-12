import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'
import { LENGTHS } from '../helpers/validations'

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.MEDIUM)
  phoneId: string

  @IsNotEmpty()
  @IsUUID()
  serviceId: string
}
