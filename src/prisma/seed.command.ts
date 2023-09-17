import { Injectable } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { Command } from "nestjs-command";

@Injectable()
export class SeedCommmand {
    constructor(private seed: SeedService) {}

    @Command({
        command: 'db:seed', 
        describe: 'Seed initial data in database for development'
    })
    async seedData() {
        await this.seed.seedInitialData();
        console.log('Data Seeded Successfully')
    }
}