import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddAppointmentDto, EditAppointmentDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppointmentService {
    constructor(private prisma: PrismaService) { }

    getAllAppointments() {
        return this.prisma.appointment.findMany();
    }

    async getAppointmentsByEmployeeId(employeeId: number) {
        // Get employee
        const employee = await this.prisma.employee.findUnique({
            where: {
                employeeId,
            },
            include: {
                appointments: true,
            },
        })

        // Check if employee exists 
        if (!employee) {
            throw new NotFoundException('employeeId does not exist')
        }

        // Return doctor's appointments
        return employee.appointments;
    }

    async getAppointmentsByPatientId(patientId: number) {
        // Get employee
        const patient = await this.prisma.patient.findUnique({
            where: {
                patientId,
            },
            include: {
                appointments: true,
            },
        })

        // Check if employee exists 
        if (!patient) {
            throw new NotFoundException('patientId does not exist')
        }

        // Return doctor's appointments
        return patient.appointments;
    }


    async addAppointment(dto: AddAppointmentDto) {
        // Get patient by patientId
        const patient = await this.prisma.patient.findUnique({
            where: {
                patientId: dto.patientId,
            }
        })

        // Check if patient exists
        if (!patient) {
            throw new NotFoundException('patientId does not exist')
        }

        // Get employee by employeeId
        const employee = await this.prisma.employee.findUnique({
            where: {
                employeeId: dto.employeeId,
            }
        })

        // Check if employee exists
        if (!employee) {
            throw new NotFoundException('employeeId does not exist');
        }

        // Make sure no conflicting appointments
        const existing_appointment = await this.prisma.appointment.findFirst({
            where: {
                OR: [
                    {
                        patient: { patientId: dto.patientId },
                        appointmentDateTime: new Date(dto.appointmentDateTime).toISOString(),
                    },
                    {
                        employee: { employeeId: dto.employeeId },
                        appointmentDateTime: new Date(dto.appointmentDateTime).toISOString(),
                    },
                ]
            }
        })

        if (existing_appointment) {
            throw new ForbiddenException('Conflicting appointment already exists');
        }


        // Add appointment
        try {
            const appointment = await this.prisma.appointment.create({
                data: {
                    patient: { connect: { patientId: dto.patientId } },                  // Connect the patient
                    employee: { connect: { employeeId: dto.employeeId } },               // Connect the employee
                    appointmentDateTime: new Date(dto.appointmentDateTime).toISOString(),
                    reason: dto.reason,
                    remarks: dto.remarks,
                    completed: dto.completed,
                }
            });

            return appointment;

        } catch (error) {
            // Throw ForbiddenException if criteria not followed
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        error.message.split('\n').slice(8)
                    )
                }
            }
            throw error;
        }
    }

    async editAppointmentById(appointmentId: number, dto: EditAppointmentDto) {
        // get appointment by patientId
        const appointment = await this.prisma.appointment.findUnique({
            where: {
                appointmentId,
            }
        })

        // check if appointment exists
        if (!appointment) {
            throw new NotFoundException('appointmentId does not exist')
        }

        // edit patient information and return if successful
        return this.prisma.appointment.update({
            where: {
                appointmentId
            },
            data: {
                ...dto,
                ...(dto.appointmentDateTime ? { appointmentDateTime: new Date(dto.appointmentDateTime).toISOString() } : {}), // edited date toISOStringif it exists
            }
        });
    }

    async deleteAppointmentById(appointmentId: number) {
        try {
            await this.prisma.appointment.delete({
                where: {
                    appointmentId,
                }
            })

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new NotFoundException(
                        error.message.split('\n').slice(8)
                )
            }

            throw error;
        }  
    }
}
