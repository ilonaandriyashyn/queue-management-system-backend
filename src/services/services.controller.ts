import { Controller } from '@nestjs/common'
import { ServicesService } from './services.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
}
