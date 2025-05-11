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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const path_1 = require("path");
let MailService = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendUserCredentials(email, password, licensePlate, marque, modele) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Bienvenue sur le service de paiement des taxes',
                template: (0, path_1.join)(__dirname, '../../templates/welcome.hbs'),
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
                        path: (0, path_1.join)(__dirname, '../../assets/images/logo.png'),
                        cid: 'logo',
                    },
                ],
            });
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
    async sendPaymentConfirmation(email, licensePlate, amount, startPeriod, endPeriod) {
        const startMonth = startPeriod.toLocaleString('fr-FR', { month: 'long' });
        const startYear = startPeriod.getFullYear();
        const endMonth = endPeriod.toLocaleString('fr-FR', { month: 'long' });
        const endYear = endPeriod.getFullYear();
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Confirmation de paiement des taxes',
                template: (0, path_1.join)(__dirname, '../../templates/paymentConfirmation.hbs'),
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
                        path: (0, path_1.join)(__dirname, '../../assets/images/logo.png'),
                        cid: 'logo',
                    },
                ],
            });
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map