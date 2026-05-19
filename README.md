# Coopers — Organize your daily jobs

Full-stack monorepo in Next.js 16 with todo list, authentication, drag-and-drop, carousel and email contact.

## Tech Stack

- **Frontend**: Next.js 16 (Turbopack), React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes at `/api/v1/...`
- **Database**: PostgreSQL (Neon) via TypeORM 0.3
- **Auth**: JWT in httpOnly cookies (bcryptjs)
- **Drag & Drop**: @dnd-kit
- **Email**: Resend

## Development Process / Descritivo

See [DEVELOPMENT.md](./DEVELOPMENT.md) for a detailed account of the development process, challenges encountered, and solutions adopted.

## Setup

### 1. Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
cp .env.local.example .env.local
```

```env
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
JWT_SECRET=your-strong-random-secret
RESEND_API_KEY=re_your_key
CONTACT_EMAIL=your@email.com
```

### 2. Run migrations

```bash
npm run migration:run
```

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

| Method | Route                                   | Auth   | Description    |
| ------ | --------------------------------------- | ------ | -------------- |
| POST   | `/api/v1/auth/register`                 | —      | Create account |
| POST   | `/api/v1/auth/login`                    | —      | Sign in        |
| POST   | `/api/v1/auth/logout`                   | —      | Sign out       |
| GET    | `/api/v1/auth/me`                       | Cookie | Current user   |
| GET    | `/api/v1/todos`                         | ✓      | List todos     |
| POST   | `/api/v1/todos`                         | ✓      | Create todo    |
| PATCH  | `/api/v1/todos/:id`                     | ✓      | Update todo    |
| DELETE | `/api/v1/todos/:id`                     | ✓      | Delete todo    |
| DELETE | `/api/v1/todos?type=pending\|completed` | ✓      | Erase all      |
| POST   | `/api/v1/contact`                       | —      | Send email     |

## Features

- **Authentication** — Register / Login modal, JWT cookie session
- **To-do List** — Drag-and-drop reorder, click-to-edit, check/uncheck, hover-to-delete, erase all
- **Good Things** — Horizontal carousel with dot navigation
- **Contact Form** — Sends email via Resend
- **Mobile First** — Responsive layout for all screen sizes

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run migration:run     # Run DB migrations
npm run migration:revert  # Revert last migration
```
