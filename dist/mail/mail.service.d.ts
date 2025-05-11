import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserCredentials(email: string, password: string, licensePlate: string, marque: string, modele: string): Promise<void>;
    sendPaymentConfirmation(email: string, licensePlate: string, amount: number, startPeriod: Date, endPeriod: Date): Promise<void>;
}
