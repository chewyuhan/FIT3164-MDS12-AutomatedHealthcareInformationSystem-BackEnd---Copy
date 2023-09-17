import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeeService {
    constructor(private prisma: PrismaService) {}

    getDoctors() {
        return this.prisma.employee.findMany({
            where: {
                title: 'Doctor',
            },
            select: {
                employeeId: true,
                firstName: true,
                lastName: true,
                specialty: true,
            }
        })
    }
}
