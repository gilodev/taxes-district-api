import { Expose } from 'class-transformer';

export class PaymentResponseDto {
  @Expose()
  id: string;

  @Expose()
  amount: number;

  @Expose()
  paymentDate: Date;

  @Expose()
  startPeriod: Date;

  @Expose()
  endPeriod: Date;
}