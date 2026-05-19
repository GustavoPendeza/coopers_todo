import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TodoSchema } from './src/entities/Todo';
import { UserSchema } from './src/entities/User';
import { CreateUsersTable1700000001000 } from './src/migrations/1700000001000-CreateUsersTable';
import { CreateTodosTable1700000002000 } from './src/migrations/1700000002000-CreateTodosTable';

dotenv.config({ path: '.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ...(process.env.NODE_ENV === 'production' ? { ssl: { rejectUnauthorized: false } } : {}),
  synchronize: false,
  logging: true,
  entities: [UserSchema, TodoSchema],
  migrations: [CreateUsersTable1700000001000, CreateTodosTable1700000002000],
  subscribers: []
});

export default AppDataSource;
