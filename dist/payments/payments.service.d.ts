import { PrismaService } from '@/prisma/prisma.service';
import { PaymentInfoDto } from './dto/payment-info.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { MailService } from '@/mail/mail.service';
export declare class PaymentsService {
    private prisma;
    private vehiclesService;
    private mailService;
    constructor(prisma: PrismaService, vehiclesService: VehiclesService, mailService: MailService);
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
    getPaymentHistory(vehicleId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        paymentDate: Date;
        startPeriod: Date;
        endPeriod: Date;
        vehicleId: string;
    }[]>;
}
