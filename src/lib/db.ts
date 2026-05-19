import { TodoSchema } from '@/entities/Todo';
import { UserSchema } from '@/entities/User';
import { CreateUsersTable1700000001000 } from '@/migrations/1700000001000-CreateUsersTable';
import { CreateTodosTable1700000002000 } from '@/migrations/1700000002000-CreateTodosTable';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

declare global {
  var _appDataSource: DataSource | undefined;
}

function createDataSource(): DataSource {
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ...(process.env.NODE_ENV === 'production' ? { ssl: { rejectUnauthorized: false } } : {}),
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [UserSchema, TodoSchema],
    migrations: [CreateUsersTable1700000001000, CreateTodosTable1700000002000],
    subscribers: []
  });
}

export async function getDataSource(): Promise<DataSource> {
  if (globalThis._appDataSource?.isInitialized) {
    return globalThis._appDataSource;
  }

  const ds = globalThis._appDataSource ?? createDataSource();
  globalThis._appDataSource = ds;

  if (!ds.isInitialized) {
    await ds.initialize();
    await ds.runMigrations();
  }

  return ds;
}

