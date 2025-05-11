import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { RegisterVehicleDto } from './dto/register-vehicle.dto';
import { Public, RequiresApiKey } from '@/common/decorators/public.decorator';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post('register')
  @Public()
  @RequiresApiKey()
  async registerVehicle(
    @Body() registerVehicleDto: RegisterVehicleDto,
  ) {

    return this.vehiclesService.registerVehicle(registerVehicleDto);
  }

  @Get('find/:licensePlate')
  async getVehicleByLicensePlate(@Param('licensePlate') licensePlate: string) {
    return this.vehiclesService.getVehicleByLicensePlate(licensePlate);
  }
}