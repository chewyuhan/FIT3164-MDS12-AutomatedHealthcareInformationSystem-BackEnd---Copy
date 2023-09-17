import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class EditAppointmentDto {
    @IsInt()
    @IsOptional()
    patientId?: number

    @IsInt()
    @IsOptional()
    employeeId?: number

    @IsDateString()
    @IsOptional()
    appointmentDateTime?: Date

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