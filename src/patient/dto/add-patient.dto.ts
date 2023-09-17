import { IsDateString, IsEmail, IsMobilePhone, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class AddPatientDto {
    @IsNumberString()
    @IsNotEmpty()
    ic: string

    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string
    
    @IsDateString()
    @IsNotEmpty()
    dob: Date

    @IsString()
    @IsNotEmpty()
    gender: string

    @IsString()
    @IsNotEmpty()
    nationality: string

    @IsMobilePhone()
    @IsNotEmpty()
    phoneNo: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsMobilePhone()
    @IsOptional()
    emergencyNo?: string

    @IsString()
    @IsOptional()
    emergencyRemarks?: string

    @IsString()
    @IsOptional()
    remarks?: string
}

