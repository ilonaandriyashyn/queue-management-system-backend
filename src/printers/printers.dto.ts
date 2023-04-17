import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePrinterDto {
  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @IsNotEmpty()
  @IsUUID()
  officeId: string
}
