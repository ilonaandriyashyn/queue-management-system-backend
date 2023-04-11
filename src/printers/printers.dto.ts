import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreatePrinterDto {
  @IsNotEmpty()
  @IsUUID()
  officeId: string
}
