import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { AppointmentService } from './appointment.service';
import { AddAppointmentDto, EditAppointmentDto } from './dto';

@UseGuards(JwtGuard)
@Controller('appointments')
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) {}

    @Get('all')
    getAllAppointments() {
        return this.appointmentService.getAllAppointments();
    }

    @Get('employee/:id')
    getAppointmentsByEmployeeId(@Param('id', ParseIntPipe) employeeId: number) {
        return this.appointmentService.getAppointmentsByEmployeeId(employeeId);
    }

    @Get('patient/:id')
    getAppointmentsByPatientId(@Param('id', ParseIntPipe) patientId: number) {
        return this.appointmentService.getAppointmentsByPatientId(patientId);
    }

    @Post()
    addAppointment(@Body() dto: AddAppointmentDto) {
        return this.appointmentService.addAppointment(dto);
    }

    @Patch(':id')
    editAppointmentById(
        @Param('id', ParseIntPipe) appointmentId: number,
        @Body() dto: EditAppointmentDto
    ) {
        return this.appointmentService.editAppointmentById(appointmentId, dto);
    }

    @Delete(':id')
    deleteAppointmentById(@Param('id', ParseIntPipe) appointmentId: number) {
        return this.appointmentService.deleteAppointmentById(appointmentId);
    }
}
