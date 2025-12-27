import { Constructor, EntityManager } from '@mikro-orm/postgresql';
import { Factory } from '@mikro-orm/seeder';
import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserRepository } from 'src/repositories/user.repository';

let factories = new Map();

export function createEmFork() {
  const emFork = TestContext.em.fork({ useContext: true });

  let transactionCtxOverride = null;

  Object.defineProperty(emFork, 'transactionContext', {
    get: () => {
      return transactionCtxOverride ?? TestContext.em.getTransactionContext();
    },

    set: (value) => {
      transactionCtxOverride = value;
    },
  });

  TestContext.em.getEventManager().registerSubscriber({
    afterTransactionRollback: () => {
      emFork.clear();
      transactionCtxOverride = null;
    },
  });

  return emFork;
}

// function createEmFork() {
//     const  emFork  = TestContext.em.fork()

//     if (!emFork) {
//         throw new Error('ORM not initialized')
//     }

//     return emFork
// }

export const TestContext = {
  get em(): EntityManager {
    if (!global.orm) {
      throw new Error('make sure the setup file get run first.');
    }
    return global.orm.em;
  },

  getFactory<T extends Factory<any>>(type: Constructor<T>): T {
    const { em } = TestContext;

    if (!em) {
      throw new Error('Entity manager not available');
    }

    let factory = factories.get(type);
    if (!factory) {
      factory = new type(em);
      factories.set(type, factory);
    }

    return factory;
  },

  createModule(metadata: ModuleMetadata) {
    return Test.createTestingModule({
      ...metadata,
      imports: [
        ...(metadata.imports ?? []),
        ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
          envFilePath: '.env.test',
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '24h' },
        }),
      ],
      providers: [
        ...(metadata.providers ?? []),
        UserRepository,
        {
          provide: EntityManager,
          useValue: createEmFork(),
        },
      ],
    });
  },
};
