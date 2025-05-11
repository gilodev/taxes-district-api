import { Exclude, Expose, Type } from 'class-transformer';
import { VehicleResponseDto } from '@/vehicles/dto/vehicle-response.dto';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  @Type(() => VehicleResponseDto)
  vehicles: VehicleResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}