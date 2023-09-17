import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthSignInDto, AuthSignUpDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService,
    ) {}

    async signToken(employeeId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: employeeId,
            email,
        };

        const secret = this.config.get("JWT_SECRET");

        const token = await this.jwt.signAsync(
            payload,
            {
                // might add expire time?
                secret: secret
            }
        )

        return { access_token: token };
    };

    async signup(dto: AuthSignUpDto) {
        // Generate hash of password
        const hash = await argon.hash(dto.password);

        // Verify administrator code
        if (dto.adminCode != this.config.get('ADMIN_CODE')) {
            throw new ForbiddenException('Admin Code Incorrect');
        }
        
        try {
             // Save new employee in database
            const employee = await this.prisma.employee.create({
                data: {
                    email: dto.email,
                    hash,
                    ic: dto.ic,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    dob: new Date(dto.dob).toISOString(),
                    gender: dto.gender,
                    nationality: dto.nationality,
                    phoneNo: dto.phoneNo,
                    emergencyNo: dto.emergencyNo,
                    title: dto.title,
                    specialty: dto.specialty
                }
            });

            // Return the employee's access token
            return this.signToken(employee.employeeId, employee.email)

        } catch (error) {
            // Throw ForbiddenException if unique criteria not followed
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        "Credentials Taken: " + error.message.split('\n').slice(8)
                    );
                }
            }
            throw error;
        }
    }

    async signin(dto: AuthSignInDto) {
        // Find the employee by email
        const employee = await this.prisma.employee.findUnique({
            where: {
                email: dto.email,
            },
        });

        // If employee doesn't exist, throw exception
        if (!employee) {
            throw new ForbiddenException('Credentials Incorrect: User Does Not Exist');
        }

        // Verify password
        const pwMatches = await argon.verify(
            employee.hash,
            dto.password
        )

        // If passwoord incorrect, throw exception
        if (!pwMatches) {
            throw new ForbiddenException("Credentials Incorrect: Password is Incorrect")
        }

        // Return employee's access_token
        return this.signToken(employee.employeeId, employee.email)
    }
}
