import { Expose, Type } from 'class-transformer';
import { PaymentResponseDto } from '@/payments/dto/payment.response.dto';

class LinkedPersonResponseDto {
  @Expose()
  id: string;

  @Expose()
  nom: string;

  @Expose()
  role: string;

  @Expose()
  telephone: string;
}

export class VehicleResponseDto {
  @Expose()
  id: string;

  @Expose()
  licensePlate: string;

  @Expose()
  marque: string;

  @Expose()
  modele: string;

  @Expose()
  dateCirculation: Date;

  @Expose()
  utilisation: string;

  @Expose()
  ownerType: string;

  @Expose()
  ownerNom?: string;

  @Expose()
  ownerPrenoms?: string;

  @Expose()
  ownerTelephone?: string;

  @Expose()
  ownerRccm?: string;

  @Expose()
  @Type(() => LinkedPersonResponseDto)
  linkedPersons: LinkedPersonResponseDto[];

  @Expose()
  @Type(() => PaymentResponseDto)
  payments: PaymentResponseDto[];

  @Expose()
  createdAt: Date;
}