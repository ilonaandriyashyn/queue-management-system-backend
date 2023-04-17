import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class IdParam {
  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @IsUUID()
  id: string
}
