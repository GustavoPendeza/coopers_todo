import { User } from '@/entities/User';
import { authCookieOptions, signToken } from '@/lib/auth';
import { getDataSource } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username?.trim() || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    if (username.trim().length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository<User>('User');

    const existing = await repo.findOne({
      where: { username: username.trim() }
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = repo.create({ username: username.trim(), password_hash });
    await repo.save(user);

    const token = signToken({ userId: user.id, username: user.username });
    const response = NextResponse.json(
      { user: { id: user.id, username: user.username } },
      { status: 201 }
    );
    response.cookies.set(authCookieOptions(token));
    return response;
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
