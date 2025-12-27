import {
  defineConfig,
  MigrationObject,
  MikroORMOptions,
  PostgreSqlDriver,
  Utils,
} from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';
import entities from './entities/index';
import { SoftDeleteHandler } from 'mikro-orm-soft-delete';
import { SeedManager } from '@mikro-orm/seeder';
import { Migrator } from '@mikro-orm/migrations'; // or
dotenv.config({ path: '.env' });

const config = new ConfigService();

export default defineConfig({
  entities: entities,
  clientUrl: config.getOrThrow('DB_URL'),
  driver: PostgreSqlDriver,

  driverOptions: { connection: { poolSize: 10 } },
  extensions: [SoftDeleteHandler, SeedManager, Migrator],
  allowGlobalContext: true,
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  }, 
});
