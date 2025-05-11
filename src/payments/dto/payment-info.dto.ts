import { IsString, IsNotEmpty } from 'class-validator';

export class PaymentInfoDto {
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;
}