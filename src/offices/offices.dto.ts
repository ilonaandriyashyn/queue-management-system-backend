import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'
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
  @IsString()
  @MaxLength(LENGTHS.MEDIUM)
  country: string

  @IsNotEmpty()
  @IsUUID()
  organizationId: string
}
