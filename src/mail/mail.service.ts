import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserCredentials(email: string, password: string, licensePlate: string, marque: string, modele: string) {
    try {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Bienvenue sur le service de paiement des taxes',
          template: join(__dirname, '../../templates/welcome.hbs'),
          context: {
            email,
            password,
            licensePlate,
            marque,
            modele
          },
          attachments: [
            {
              filename: 'logo.png',
              path: join(__dirname, '../../assets/images/logo.png'),
              cid: 'logo',
            },
          ],
        });
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
      }
  }

  async sendPaymentConfirmation(email: string, licensePlate: string, amount: number, startPeriod: Date, endPeriod: Date) {
    const startMonth = startPeriod.toLocaleString('fr-FR', { month: 'long' });
    const startYear = startPeriod.getFullYear();
    const endMonth = endPeriod.toLocaleString('fr-FR', { month: 'long' });
    const endYear = endPeriod.getFullYear();

    try {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Confirmation de paiement des taxes',
          template: join(__dirname, '../../templates/paymentConfirmation.hbs'),
          context: {
            licensePlate,
            amount,
            startMonth,
            startYear,
            endMonth,
            endYear,
          },
          attachments: [
            {
              filename: 'logo.png',
              path: join(__dirname, '../../assets/images/logo.png'),
              cid: 'logo',
            },
          ],
        });
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
      }
  }
}