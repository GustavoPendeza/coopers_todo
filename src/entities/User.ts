import { EntitySchema } from 'typeorm';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
}

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  columns: {
    id: { type: Number, primary: true, generated: true },
    username: { type: String, unique: true, length: 100 },
    password_hash: { type: String },
    created_at: { type: Date, createDate: true }
  }
});
