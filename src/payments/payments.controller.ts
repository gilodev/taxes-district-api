import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentInfoDto } from './dto/payment-info.dto';
import { Public, RequiresApiKey } from '@/common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @Public()
  @RequiresApiKey()
  async processPayment(@Body() paymentInfo: PaymentInfoDto) {
    return this.paymentsService.processPayment(paymentInfo);
  }
}