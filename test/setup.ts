import { MikroORM } from '@mikro-orm/postgresql';
import dbConfig from 'src/mikro-orm.config';
import { expand as dotenvExpand } from 'dotenv-expand';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test', override: true });

let orm: MikroORM;

beforeAll(async () => {
  dotenvExpand(dotenv.config({ path: '.env.test', override: true }));

  global.orm = orm = await MikroORM.init({
    ...dbConfig,
    clientUrl: process.env.DB_URL,
    flushMode: 'commit',
    allowGlobalContext: true,
  });

  const schemaGenerator = orm.getSchemaGenerator();
  // const schemaGenerator = orm.schema
  const isNew = await schemaGenerator.ensureDatabase();

  if (isNew) {
    await schemaGenerator.createSchema();
  } else {
    await schemaGenerator.updateSchema();
  }
});

afterEach(async () => {
  if (orm?.em) {
    try {
      if (orm.em.isInTransaction()) {
        await orm.em.rollback();
      }
      await orm.em.clear();
    } catch (error) {
      throw new Error('Could not clear database after test');
    }
  }
});

afterAll(async () => {
  if (orm) {
    await orm.getSchemaGenerator().dropSchema();
    await orm.close(true);
  }
});
