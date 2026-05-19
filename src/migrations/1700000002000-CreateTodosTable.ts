import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodosTable1700000002000 implements MigrationInterface {
  name = 'CreateTodosTable1700000002000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "todos" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "text" TEXT NOT NULL,
        "completed" BOOLEAN NOT NULL DEFAULT FALSE,
        "sort_order" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_todos_user_id" ON "todos"("user_id")`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "todos"`);
  }
}
