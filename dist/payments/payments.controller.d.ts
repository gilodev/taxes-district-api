import { PaymentsService } from './payments.service';
import { PaymentInfoDto } from './dto/payment-info.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    processPayment(paymentInfo: PaymentInfoDto): Promise<{
        success: boolean;
        payment: {
            id: string;
            amount: number;
            paymentDate: Date;
            startPeriod: Date;
            endPeriod: Date;
        };
        vehicle: {
            licensePlate: string;
            marque: string;
            modele: string;
        };
    }>;
}
