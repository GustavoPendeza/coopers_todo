import { Todo } from '@/entities/Todo';
import { getAuthUser } from '@/lib/auth';
import { getDataSource } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const auth = await getAuthUser();
  if (!auth)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ds = await getDataSource();
  const repo = ds.getRepository<Todo>('Todo');
  const todos = await repo.find({
    where: { user_id: auth.userId },
    order: { sort_order: 'ASC', created_at: 'ASC' }
  });

  return NextResponse.json({ todos });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { text } = await request.json();
  if (!text?.trim()) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  const ds = await getDataSource();
  const repo = ds.getRepository<Todo>('Todo');

  const last = await repo.findOne({
    where: { user_id: auth.userId, completed: false },
    order: { sort_order: 'DESC' }
  });

  const todo = repo.create({
    user_id: auth.userId,
    text: text.trim(),
    completed: false,
    sort_order: last ? last.sort_order + 1 : 0
  });
  await repo.save(todo);

  return NextResponse.json({ todo }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const ds = await getDataSource();
  const repo = ds.getRepository<Todo>('Todo');

  if (type === 'completed') {
    await repo.delete({ user_id: auth.userId, completed: true });
  } else if (type === 'pending') {
    await repo.delete({ user_id: auth.userId, completed: false });
  } else {
    await repo.delete({ user_id: auth.userId });
  }

  return NextResponse.json({ success: true });
}
