import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterVehicleDto } from './dto/register-vehicle.dto';

import * as bcrypt from 'bcrypt';
import { MailService } from '@/mail/mail.service';
import { generateRandomPassword } from '@/utils/password-generator.util';
import { PersonType } from 'generated/prisma';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async registerVehicle(dto: RegisterVehicleDto) {
    const { licensePlate, vehicleInfo, ownerInfo, linkedPersons } = dto;

    // Vérifier si le véhicule existe déjà
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { licensePlate },
    });

    if (existingVehicle) {
      throw new ConflictException('Un véhicule avec cette plaque d\'immatriculation existe déjà');
    }

    // Déterminer l'email et le téléphone en fonction du type de personne
    let email: string, telephone: string;
    
    if (ownerInfo.typePerson === 'physical') {
      if (!ownerInfo.physical) {
        throw new BadRequestException('Les informations du propriétaire physique sont requises');
      }
      email = ownerInfo.physical.email;
      telephone = ownerInfo.physical.telephone;
    } else {
      if (!ownerInfo.moral) {
        throw new BadRequestException('Les informations du propriétaire moral sont requises');
      }
      email = ownerInfo.moral.email;
      telephone = ownerInfo.moral.telephone;
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Générer un mot de passe aléatoire si l'utilisateur n'existe pas
    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const marque = vehicleInfo.marque;
    const modele = vehicleInfo.modele;

    // Transaction et création du véhicule
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

        // Créer le véhicule
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
            ownerType: ownerInfo.typePerson === 'physical' ? PersonType.PHYSICAL : PersonType.MORAL,
            ownerTelephone: telephone,
            // Informations du propriétaire physique
            ...(ownerInfo.typePerson === 'physical' && {
              ownerNom: ownerInfo?.physical?.nom,
              ownerPrenoms: ownerInfo?.physical?.prenoms,
              ownerCni: ownerInfo?.physical?.cni,
            }),
            // Informations du propriétaire moral
            ...(ownerInfo.typePerson === 'moral' && {
              ownerRccm: ownerInfo?.moral?.rccm,
            }),
            // Créer les personnes liées
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

      // Envoyer un email avec les identifiants
      await this.mailService.sendUserCredentials(email, password, licensePlate, marque, modele)

      return {
        message: 'Véhicule enregistré avec succès',
        vehicle: result.vehicle,
      };
    } catch (error) {
      throw new BadRequestException('Erreur lors de l\'enregistrement du véhicule: ' + error.message);
    }
  }

  async getVehiclesByUserId(userId: string) {
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

  async getVehicleByLicensePlate(licensePlate: string) {
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
      throw new BadRequestException('Véhicule non trouvé');
    }

    return vehicle;
  }
}