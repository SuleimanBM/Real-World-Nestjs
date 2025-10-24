import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import dotenv from "dotenv"
import entities from "./entities/index"
dotenv.config()

const config = new ConfigService();

export default defineConfig({
    entities: entities,
    clientUrl: config.getOrThrow("DB_URL"),
    driver: PostgreSqlDriver,
});