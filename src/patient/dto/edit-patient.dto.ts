import { IsDateString, IsEmail, IsInt, IsMobilePhone, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class EditPatientDto {
    @IsNumberString()
    @IsOptional()
    ic?: string

    @IsString()
    @IsOptional()
    firstName?: string

    @IsString()
    @IsOptional()
    lastName?: string
    
    @IsDateString()
    @IsOptional()
    dob?: Date

    @IsString()
    @IsOptional()
    gender?: string

    @IsString()
    @IsOptional()
    nationality?: string

    @IsMobilePhone()
    @IsOptional()
    phoneNo?: string

    @IsEmail()
    @IsOptional()
    email?: string

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