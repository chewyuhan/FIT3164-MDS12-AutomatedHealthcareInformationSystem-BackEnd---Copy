import { Injectable, NotFoundException } from '@nestjs/common';
import { AddDiagnosisDto, EditDiagnosisDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiagnosisService {
    constructor(private prisma: PrismaService) { }

    getAllDiagnoses() {
        return this.prisma.diagnosis.findMany();
    }

    async getDiagnosesByPatientId(patientId: number) {
        // Get patient by patientId
        const patient= await this.prisma.patient.findUnique({
            where: {
                patientId
            }
        })

        // Check if appointment exists
        if (!patient) {
            throw new NotFoundException('patientId does not exist');
        }

        return await this.prisma.diagnosis.findMany({
            where: {
                appointment: {
                    patientId,
                }
            }
        })
    }
    
    async addDiagnosis(dto: AddDiagnosisDto) {
        // Get appointment by appointmentId
        const appointment = await this.prisma.appointment.findUnique({
            where: {
                appointmentId: dto.appointmentId,
            }
        })

        // Check if appointment exists
        if (!appointment) {
            throw new NotFoundException('appointmentId does not exist');
        }

        // Create diagnosis
        const diagnosis = await this.prisma.diagnosis.create({
            data: {
                ...dto,
            },
        })

        return diagnosis;
    }

    async editDiagnosisById(diagnosisId: number, dto: EditDiagnosisDto) {
        // Get diagnosis by diagnosisId
        const diagnosis = this.prisma.diagnosis.findUnique({
            where: {
                diagnosisId,
            }
        })

        // Check if diagnosis exists
        if (!diagnosis) {
            throw new NotFoundException('diagnosisId does not exist');
        }

        // Get appointment by appointmentId
        const appointment = this.prisma.appointment.findUnique({
            where: {
                appointmentId: dto.appointmentId,
            }
        })

        // Check if appointment exists
        if (!appointment) {
            throw new NotFoundException('appointmentId does not exist');
        }

        // If diagnosis exist update diagnosis and return object
        return this.prisma.diagnosis.update({
            where: {
                diagnosisId,
            },
            data: {
                ...dto,
            }
        })
    }

    async deleteDiagnosisById(diagnosisId: number) {
        try {
            await this.prisma.diagnosis.delete({
                where: {
                    diagnosisId,
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
