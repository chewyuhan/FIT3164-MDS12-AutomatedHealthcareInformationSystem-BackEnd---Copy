import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { GetMyInfo } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EmployeeService } from './employee.service';

@UseGuards(JwtGuard)
@Controller('employees')
export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}

    @Get('myinfo')
    getMyInfo(@GetMyInfo() employee: Employee) {
        return employee;
    }

    @Get('doctors')
    getDoctors() {
        return this.employeeService.getDoctors();
    }
}
