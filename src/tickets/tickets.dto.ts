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

export class CreateTicketFromPrinterDto {
  @IsNotEmpty()
  @IsUUID()
  serviceId: string
}

export class CreateTicketFromPrinterHeadersDto {
  @IsNotEmpty()
  authorization: string
}

export class ServiceAndDeviceParams {
  @IsUUID()
  serviceId: string

  @IsUUID()
  phoneId: string
}

export class PhoneIdParam {
  @IsUUID()
  phoneId: string
}
