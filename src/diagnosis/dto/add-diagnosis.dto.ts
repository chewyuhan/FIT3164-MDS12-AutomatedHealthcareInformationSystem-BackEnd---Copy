import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AddDiagnosisDto {
    @IsInt()
    @IsNotEmpty()
    appointmentId: number

    @IsString()
    @IsNotEmpty()
    icd: string

    @IsString()
    @IsOptional()
    symptoms?: string

    @IsString()
    @IsOptional()
    remarks?: string
}
