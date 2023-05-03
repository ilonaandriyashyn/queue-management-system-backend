import { IsArray, IsISO31661Alpha2, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'
import { LENGTHS } from '../helpers/validations'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateOfficeDto {
  @ApiProperty({ example: 'Thakurova' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.STANDARD)
  street: string

  @ApiProperty({ example: '9' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.SHORT)
  block: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(LENGTHS.SHORT)
  building: string

  @ApiProperty({ example: 'Prague' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.MEDIUM)
  city: string

  @ApiProperty({ example: '160 00' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.SHORT)
  postCode: string

  @ApiProperty({ example: 'CZ' })
  @IsNotEmpty()
  @IsISO31661Alpha2()
  @MaxLength(2)
  countryCode: string

  @ApiProperty({ example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' })
  @IsNotEmpty()
  @IsUUID()
  organizationId: string
}

export class UpdateOfficeServicesDto {
  @ApiProperty({ example: ['XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY'] })
  // uuid of services
  @IsArray()
  services: string[]
}

export class CreateServiceDto {
  @ApiProperty({ example: 'Service 1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.STANDARD)
  name: string
}
