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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const mail_service_1 = require("../mail/mail.service");
const password_generator_util_1 = require("../utils/password-generator.util");
const prisma_1 = require("../../generated/prisma/index.js");
let VehiclesService = class VehiclesService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async registerVehicle(dto) {
        const { licensePlate, vehicleInfo, ownerInfo, linkedPersons } = dto;
        const existingVehicle = await this.prisma.vehicle.findUnique({
            where: { licensePlate },
        });
        if (existingVehicle) {
            throw new common_1.ConflictException('Un véhicule avec cette plaque d\'immatriculation existe déjà');
        }
        let email, telephone;
        if (ownerInfo.typePerson === 'physical') {
            if (!ownerInfo.physical) {
                throw new common_1.BadRequestException('Les informations du propriétaire physique sont requises');
            }
            email = ownerInfo.physical.email;
            telephone = ownerInfo.physical.telephone;
        }
        else {
            if (!ownerInfo.moral) {
                throw new common_1.BadRequestException('Les informations du propriétaire moral sont requises');
            }
            email = ownerInfo.moral.email;
            telephone = ownerInfo.moral.telephone;
        }
        let user = await this.prisma.user.findUnique({
            where: { email },
        });
        const password = (0, password_generator_util_1.generateRandomPassword)();
        const hashedPassword = await bcrypt.hash(password, 10);
        const marque = vehicleInfo.marque;
        const modele = vehicleInfo.modele;
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                if (!user) {
                    user = await tx.user.create({
                        data: {
                            email,
                            password: hashedPassword,
                        },
                    });
                }
                const vehicle = await tx.vehicle.create({
                    data: {
                        licensePlate,
                        marque,
                        modele,
                        dateCirculation: new Date(vehicleInfo.dateCirculation),
                        carteGrise: vehicleInfo.carteGrise,
                        utilisation: vehicleInfo.utilisation,
                        preciser: vehicleInfo.preciser,
                        userId: user.id,
                        ownerType: ownerInfo.typePerson === 'physical' ? prisma_1.PersonType.PHYSICAL : prisma_1.PersonType.MORAL,
                        ownerTelephone: telephone,
                        ...(ownerInfo.typePerson === 'physical' && {
                            ownerNom: ownerInfo?.physical?.nom,
                            ownerPrenoms: ownerInfo?.physical?.prenoms,
                            ownerCni: ownerInfo?.physical?.cni,
                        }),
                        ...(ownerInfo.typePerson === 'moral' && {
                            ownerRccm: ownerInfo?.moral?.rccm,
                        }),
                        linkedPersons: {
                            create: linkedPersons.map(person => ({
                                nom: person.nom,
                                role: person.role,
                                telephone: person.telephone,
                            })),
                        },
                    },
                    include: {
                        linkedPersons: true,
                    },
                });
                return { user, vehicle, password };
            });
            await this.mailService.sendUserCredentials(email, password, licensePlate, marque, modele);
            return {
                message: 'Véhicule enregistré avec succès',
                vehicle: result.vehicle,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Erreur lors de l\'enregistrement du véhicule: ' + error.message);
        }
    }
    async getVehiclesByUserId(userId) {
        return this.prisma.vehicle.findMany({
            where: { userId },
            include: {
                linkedPersons: true,
                payments: {
                    orderBy: {
                        paymentDate: 'desc',
                    },
                },
            },
        });
    }
    async getVehicleByLicensePlate(licensePlate) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { licensePlate },
            include: {
                user: true,
                linkedPersons: true,
                payments: {
                    orderBy: {
                        paymentDate: 'desc',
                    },
                },
            },
        });
        if (!vehicle) {
            throw new common_1.BadRequestException('Véhicule non trouvé');
        }
        return vehicle;
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map