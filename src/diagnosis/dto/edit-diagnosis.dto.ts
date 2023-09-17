import { IsInt, IsOptional, IsString } from "class-validator"

export class EditDiagnosisDto {
    @IsInt()
    @IsOptional()
    appointmentId?: number

    @IsString()
    @IsOptional()
    icd?: string

    @IsString()
    @IsOptional()
    symptoms?: string

    @IsString()
    @IsOptional()
    remarks?: string
}