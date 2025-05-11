import { PaymentResponseDto } from '@/payments/dto/payment.response.dto';
declare class LinkedPersonResponseDto {
    id: string;
    nom: string;
    role: string;
    telephone: string;
}
export declare class VehicleResponseDto {
    id: string;
    licensePlate: string;
    marque: string;
    modele: string;
    dateCirculation: Date;
    utilisation: string;
    ownerType: string;
    ownerNom?: string;
    ownerPrenoms?: string;
    ownerTelephone?: string;
    ownerRccm?: string;
    linkedPersons: LinkedPersonResponseDto[];
    payments: PaymentResponseDto[];
    createdAt: Date;
}
export {};
