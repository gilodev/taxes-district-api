import { VehicleResponseDto } from '@/vehicles/dto/vehicle-response.dto';
export declare class UserResponseDto {
    id: string;
    email: string;
    password: string;
    vehicles: VehicleResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
