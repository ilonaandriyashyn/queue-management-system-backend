import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Organization 1' })
  @IsNotEmpty()
  name: string
}
