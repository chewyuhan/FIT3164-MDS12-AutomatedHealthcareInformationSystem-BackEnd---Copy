import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { AddPatientDto, EditPatientDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('patients')
export class PatientController {
    constructor(private patientService: PatientService) {}

    @Get('all')
    getAllPatients() {
        return this.patientService.getAllPatients();
    }

    @Get(':id') 
    getPatientById(@Param('id', ParseIntPipe) patientId: number) {
        return this.patientService.getPatientById(patientId);
    };

    @Post()
    addPatient(@Body() dto: AddPatientDto) {
        return this.patientService.addPatient(dto);
    }

    @Patch(':id')
    editPatientById(
        @Param('id', ParseIntPipe) patientId: number,
        @Body() dto: EditPatientDto
    ) {
        return this.patientService.editPatientById(patientId, dto);
    }
}
