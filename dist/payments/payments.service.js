"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const vehicles_service_1 = require("../vehicles/vehicles.service");
const date_helper_util_1 = require("../utils/date-helper.util");
const mail_service_1 = require("../mail/mail.service");
let PaymentsService = class PaymentsService {
    constructor(prisma, vehiclesService, mailService) {
        this.prisma = prisma;
        this.vehiclesService = vehiclesService;
        this.mailService = mailService;
    }
    async processPayment(paymentInfo) {
        const { licensePlate, telephone } = paymentInfo;
        try {
            const vehicle = await this.vehiclesService.getVehicleByLicensePlate(licensePlate);
            const ownerPhone = vehicle.ownerType === 'PHYSICAL' ? vehicle.ownerTelephone : vehicle.ownerTelephone;
            if (ownerPhone !== telephone) {
                throw new common_1.BadRequestException('Le numéro de téléphone ne correspond pas au propriétaire de ce véhicule');
            }
            const { startPeriod, endPeriod } = (0, date_helper_util_1.getCurrentPeriod)();
            const amount = 25000;
            const payment = await this.prisma.payment.create({
                data: {
                    amount,
                    startPeriod,
                    endPeriod,
                    vehicleId: vehicle.id,
                },
            });
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Erreur lors du traitement du paiement: ${error.message}`);
        }
    }
    async getPaymentHistory(vehicleId) {
        return this.prisma.payment.findMany({
            where: { vehicleId },
            orderBy: { paymentDate: 'desc' },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vehicles_service_1.VehiclesService,
        mail_service_1.MailService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map