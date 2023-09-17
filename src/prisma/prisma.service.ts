import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                }
            }
        })
    }

    cleanDb() {
        // Define transaction deleting all tables with explicit ordering
        return this.$transaction([
            this.diagnosis.deleteMany(),
            this.appointment.deleteMany(),
            this.patient.deleteMany(),
            this.employee.deleteMany(),
        ]);
    }
}
