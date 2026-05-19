import { EntitySchema } from 'typeorm';

export interface Todo {
  id: number;
  user_id: number;
  text: string;
  completed: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export const TodoSchema = new EntitySchema<Todo>({
  name: 'Todo',
  tableName: 'todos',
  columns: {
    id: { type: Number, primary: true, generated: true },
    user_id: { type: Number },
    text: { type: String },
    completed: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 },
    created_at: { type: Date, createDate: true },
    updated_at: { type: Date, updateDate: true }
  }
});
