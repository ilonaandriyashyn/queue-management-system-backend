import { IsArray, IsISO31661Alpha2, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'
import { LENGTHS } from '../helpers/validations'

export class CreateOfficeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.STANDARD)
  street: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.SHORT)
  block: string

  @IsOptional()
  @IsString()
  @MaxLength(LENGTHS.SHORT)
  building: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.MEDIUM)
  city: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.SHORT)
  // TODO @IsPostalCode(locale?: string)
  postCode: string

  @IsNotEmpty()
  @IsISO31661Alpha2()
  @MaxLength(2)
  countryCode: string

  @IsNotEmpty()
  @IsUUID()
  organizationId: string
}

export class UpdateOfficeServicesDto {
  // uuid of services
  @IsArray()
  services: string[]
}

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(LENGTHS.STANDARD)
  name: string
}
