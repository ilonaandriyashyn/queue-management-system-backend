import { IsNotEmpty, IsUUID } from 'class-validator'

export class GetServicesDto {
  @IsNotEmpty()
  @IsUUID()
  organizationId: string

  @IsNotEmpty()
  @IsUUID()
  officeId: string
}
