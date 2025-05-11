import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

enum PersonType {
  PHYSICAL = 'physical',
  MORAL = 'moral',
}
class PhysicalPersonDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenoms: string;

  @IsString()
  @IsNotEmpty()
  cni: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  cniFile: any;
}

class MoralPersonDto {
  @IsString()
  @IsNotEmpty()
  rccm: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  rccmFile: any;
}

class LinkedPersonDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;
}

class VehicleInfoDto {
  @IsString()
  @IsNotEmpty()
  marque: string;

  @IsString()
  @IsNotEmpty()
  modele: string;

  @IsDateString()
  @IsNotEmpty()
  dateCirculation: string;

  @IsString()
  @IsNotEmpty()
  carteGrise: string;

  @IsString()
  @IsNotEmpty()
  utilisation: string;

  @IsString()
  @IsOptional()
  preciser?: string;

  @IsOptional()
  carteGriseFile: any;
}

class OwnerInfoDto {
  @IsEnum(PersonType)
  @IsNotEmpty()
  typePerson: PersonType;

  @ValidateNested()
  @Type(() => PhysicalPersonDto)
  @IsOptional()
  physical?: PhysicalPersonDto;

  @ValidateNested()
  @Type(() => MoralPersonDto)
  @IsOptional()
  moral?: MoralPersonDto;
}

export class RegisterVehicleDto {
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ValidateNested()
  @Type(() => VehicleInfoDto)
  vehicleInfo: VehicleInfoDto;

  @ValidateNested()
  @Type(() => OwnerInfoDto)
  ownerInfo: OwnerInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkedPersonDto)
  linkedPersons: LinkedPersonDto[];
}