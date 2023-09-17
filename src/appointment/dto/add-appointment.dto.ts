import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AddAppointmentDto {
    @IsInt()
    @IsNotEmpty()
    patientId: number

    @IsInt()
    @IsNotEmpty()
    employeeId: number

    @IsDateString()
    @IsNotEmpty()
    appointmentDateTime: Date

    @IsString()
    @IsOptional()
    reason?: string

    @IsString()
    @IsOptional()
    remarks?: string

    @IsBoolean()
    @IsOptional()
    completed?: boolean
}