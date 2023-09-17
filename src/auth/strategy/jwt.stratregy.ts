import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    // Modified validate function to append employee data in the "user" field of request
    async validate(payload: {
        sub: number,
        email: string,
    }) {
        const employee = await this.prisma.employee.findUnique({
            where: {
                employeeId: payload.sub,
            },
        });

        delete employee.hash // remove hash from employee object first
        return employee;
    }
}