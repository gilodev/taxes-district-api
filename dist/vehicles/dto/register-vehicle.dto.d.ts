declare enum PersonType {
    PHYSICAL = "physical",
    MORAL = "moral"
}
declare class PhysicalPersonDto {
    nom: string;
    prenoms: string;
    cni: string;
    telephone: string;
    email: string;
    cniFile: any;
}
declare class MoralPersonDto {
    rccm: string;
    telephone: string;
    email: string;
    rccmFile: any;
}
declare class LinkedPersonDto {
    nom: string;
    role: string;
    telephone: string;
}
declare class VehicleInfoDto {
    marque: string;
    modele: string;
    dateCirculation: string;
    carteGrise: string;
    utilisation: string;
    preciser?: string;
    carteGriseFile: any;
}
declare class OwnerInfoDto {
    typePerson: PersonType;
    physical?: PhysicalPersonDto;
    moral?: MoralPersonDto;
}
export declare class RegisterVehicleDto {
    licensePlate: string;
    vehicleInfo: VehicleInfoDto;
    ownerInfo: OwnerInfoDto;
    linkedPersons: LinkedPersonDto[];
}
export {};
