import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'
import { LENGTHS } from '../helpers/validations'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTicketDto {
  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.MEDIUM)
  phoneId: string

  @ApiProperty({ example: 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY' })
  @IsNotEmpty()
  @IsUUID()
  serviceId: string
}

export class CreateTicketFromPrinterDto {
  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @IsNotEmpty()
  @IsUUID()
  serviceId: string
}

export class CreateTicketFromPrinterHeadersDto {
  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @IsNotEmpty()
  authorization: string
}

export class ServiceAndDeviceParams {
  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @IsUUID()
  serviceId: string

  @ApiProperty({ example: 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY' })
  @IsUUID()
  phoneId: string
}

export class PhoneIdParam {
  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @IsUUID()
  phoneId: string
}
