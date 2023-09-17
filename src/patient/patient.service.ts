import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddPatientDto, EditPatientDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PatientService {
    constructor(private prisma: PrismaService) { }

    getAllPatients() {
        return this.prisma.patient.findMany();
    }
    
    getPatientById(patientId: number) {
        return this.prisma.patient.findUnique({
            where: {
                patientId,
            }
        });
    }

    async addPatient(dto: AddPatientDto) {
        try {
            const patient = await this.prisma.patient.create({
                data: {
                    ...dto,
                    dob: new Date(dto.dob).toISOString(),
                },
            });
    
            return patient

        } catch (error) {
            // Throw ForbiddenException if unique criteria not followed
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        "Credentials Taken: " + error.message.split('\n').slice(8)
                    )
                }
            }
            throw error;
        }
    }

    async editPatientById(patientId: number,dto: EditPatientDto) {
        // get patient by patientId
        const patient = await this.prisma.patient.findUnique({
            where: {
                patientId,
            }
        })

        // check if patient exists
        if (!patient) {
            throw new NotFoundException('patientId does not exist')
        }

        // edit patient information and return if successful
        return this.prisma.patient.update({
            where: {
                patientId
            },
            data: {
                ...dto,
                ...(dto.dob ? { dob: new Date(dto.dob).toISOString() } : {}), // edited date toISOStringif it exists
            } 
        });
    }
}
