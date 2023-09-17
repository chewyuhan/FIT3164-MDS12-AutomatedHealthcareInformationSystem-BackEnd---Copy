import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { AddDiagnosisDto, EditDiagnosisDto } from './dto';
import { DiagnosisService } from './diagnosis.service';

@UseGuards(JwtGuard)
@Controller('diagnoses')
export class DiagnosisController {
    constructor(private diagnosisService: DiagnosisService) {}

    @Get('all')
    getAllDiagnoses() {
        return this.diagnosisService.getAllDiagnoses();
    }

    @Get('patient/:id')
    getDiagnosesByPatientId(@Param('id', ParseIntPipe) patientId: number) {
        return this.diagnosisService.getDiagnosesByPatientId(patientId);
    }

    @Post()
    addDiagnosis(@Body() dto: AddDiagnosisDto) {
        return this.diagnosisService.addDiagnosis(dto);
    }

    @Patch(':id')
    editDiagnosisById(
        @Param('id', ParseIntPipe) diagnosisId: number,
        @Body() dto: EditDiagnosisDto
    ) {
        return this.diagnosisService.editDiagnosisById(diagnosisId, dto);
    }

    @Delete(':id')
    deleteDiagnosisById(@Param('id', ParseIntPipe) diagnosisId: number) {
        return this.diagnosisService.deleteDiagnosisById(diagnosisId);
    }
}
