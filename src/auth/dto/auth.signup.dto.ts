import { IsDateString, IsEmail, IsMobilePhone, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class AuthSignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

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

    @IsMobilePhone()
    @IsOptional()
    emergencyNo?: string

    @IsString()
    @IsOptional()
    emergencyRemarks?: string

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    specialty?: string

    @IsNotEmpty()
    adminCode: string
}