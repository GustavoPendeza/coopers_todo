import { Todo } from '@/entities/Todo';
import { getAuthUser } from '@/lib/auth';
import { getDataSource } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUser();
  if (!auth)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const todoId = parseInt(id);
  if (isNaN(todoId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const ds = await getDataSource();
  const repo = ds.getRepository<Todo>('Todo');

  const todo = await repo.findOne({
    where: { id: todoId, user_id: auth.userId }
  });
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();
  if (body.text !== undefined) todo.text = body.text.trim() || todo.text;
  if (body.completed !== undefined) todo.completed = body.completed;
  if (body.sort_order !== undefined) todo.sort_order = body.sort_order;

  await repo.save(todo);
  return NextResponse.json({ todo });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUser();
  if (!auth)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const todoId = parseInt(id);
  if (isNaN(todoId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const ds = await getDataSource();
  const repo = ds.getRepository<Todo>('Todo');

  const result = await repo.delete({ id: todoId, user_id: auth.userId });
  if (!result.affected) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
