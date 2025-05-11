import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PaymentInfoDto } from './dto/payment-info.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { getCurrentPeriod } from '@/utils/date-helper.util';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private vehiclesService: VehiclesService,
    private mailService: MailService,
  ) {}

  async processPayment(paymentInfo: PaymentInfoDto) {
    const { licensePlate, telephone } = paymentInfo;

    try {
      // Récupérer les informations du véhicule
      const vehicle = await this.vehiclesService.getVehicleByLicensePlate(licensePlate);

      // Vérifier que le téléphone correspond
      const ownerPhone = vehicle.ownerType === 'PHYSICAL' ? vehicle.ownerTelephone : vehicle.ownerTelephone;
      if (ownerPhone !== telephone) {
        throw new BadRequestException('Le numéro de téléphone ne correspond pas au propriétaire de ce véhicule');
      }

      
      const { startPeriod, endPeriod } = getCurrentPeriod();

      
      const amount = 25000;

      // Créer l'enregistrement de paiement
      const payment = await this.prisma.payment.create({
        data: {
          amount,
          startPeriod,
          endPeriod,
          vehicleId: vehicle.id,
        },
      });

      // Envoyer un email avec les informations de paiement
      await this.mailService.sendPaymentConfirmation(vehicle.user.email, licensePlate, amount, startPeriod, endPeriod);

      return {
        success: true,
        payment: {
          id: payment.id,
          amount: payment.amount,
          paymentDate: payment.paymentDate,
          startPeriod: payment.startPeriod,
          endPeriod: payment.endPeriod,
        },
        vehicle: {
          licensePlate: vehicle.licensePlate,
          marque: vehicle.marque,
          modele: vehicle.modele,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Erreur lors du traitement du paiement: ${error.message}`);
    }
  }

  async getPaymentHistory(vehicleId: string) {
    return this.prisma.payment.findMany({
      where: { vehicleId },
      orderBy: { paymentDate: 'desc' },
    });
  }
}