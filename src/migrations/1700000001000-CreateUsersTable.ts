import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1700000001000 implements MigrationInterface {
  name = 'CreateUsersTable1700000001000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR(100) UNIQUE NOT NULL,
        "password_hash" TEXT NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
