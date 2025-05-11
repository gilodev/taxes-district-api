import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    getHistory(req: any): Promise<{
        vehicles: ({
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
            utilisation: import("generated/prisma").$Enums.VehicleUsage;
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
        })[];
    } & {
        email: string;
        password: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
