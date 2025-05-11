import { VehiclesService } from './vehicles.service';
import { RegisterVehicleDto } from './dto/register-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    registerVehicle(registerVehicleDto: RegisterVehicleDto): Promise<{
        message: string;
        vehicle: {
            linkedPersons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                vehicleId: string;
                nom: string;
                role: string;
                telephone: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            licensePlate: string;
            marque: string;
            modele: string;
            dateCirculation: Date;
            carteGrise: string;
            utilisation: string;
            preciser: string | null;
            carteGriseFile: string | null;
            userId: string;
            ownerType: import("generated/prisma").$Enums.PersonType;
            ownerNom: string | null;
            ownerPrenoms: string | null;
            ownerCni: string | null;
            ownerTelephone: string | null;
            ownerCniFile: string | null;
            ownerRccm: string | null;
            ownerRccmFile: string | null;
        };
    }>;
    getVehicleByLicensePlate(licensePlate: string): Promise<{
        user: {
            email: string;
            password: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            paymentDate: Date;
            startPeriod: Date;
            endPeriod: Date;
            vehicleId: string;
        }[];
        linkedPersons: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vehicleId: string;
            nom: string;
            role: string;
            telephone: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        licensePlate: string;
        marque: string;
        modele: string;
        dateCirculation: Date;
        carteGrise: string;
        utilisation: string;
        preciser: string | null;
        carteGriseFile: string | null;
        userId: string;
        ownerType: import("generated/prisma").$Enums.PersonType;
        ownerNom: string | null;
        ownerPrenoms: string | null;
        ownerCni: string | null;
        ownerTelephone: string | null;
        ownerCniFile: string | null;
        ownerRccm: string | null;
        ownerRccmFile: string | null;
    }>;
}
