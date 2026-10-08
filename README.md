# AppTrackr — Job Application Tracker

A full-stack SaaS web application for tracking job applications, built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features
- Secure user registration and login with NextAuth.js (JWT)
- Add, edit, and delete job applications
- Track status: Applied, Screening, Interview, Offer, Rejected, Withdrawn
- Dashboard with live stats — total applications, interviews, offers, rejections
- Filter applications by status
- Fully responsive dark UI built with Tailwind CSS

## Tech Stack
Next.js 14 | TypeScript | Prisma ORM | PostgreSQL | NextAuth.js | Tailwind CSS | Docker

## Project Structure
apptrackr/
├── app/
│ ├── (auth)/login/ # Login page
│ ├── (auth)/register/ # Register page
│ ├── api/applications/ # REST API — CRUD
│ ├── api/auth/ # NextAuth handler
│ ├── api/register/ # User registration API
│ └── dashboard/ # Protected dashboard
├── lib/prisma.ts # Prisma client singleton
├── prisma/schema.prisma # Database schema
├── types/index.ts # Shared TypeScript types
├── auth.ts # NextAuth configuration
└── middleware.ts # Route protection


## How to Run

1. Clone the repository:
```bash
   git clone https://github.com/LoloM-19/apptrackr.git
   cd apptrackr
```
2. Install dependencies:
```bash
   npm install
```
3. Set up environment variables — create a `.env` file:
DATABASE_URL="postgresql://apptrackr:apptrackr123@localhost:5432/apptrackr"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

4. Start PostgreSQL:
```bash
   docker compose up postgres -d
```
5. Run database migrations:
```bash
   npx prisma@5.22.0 migrate dev
```
6. Start the app:
```bash
   npm run dev
```
7. Open **http://localhost:3000**

## Tech Stack
Next.js | TypeScript | Prisma | PostgreSQL | NextAuth.js | Tailwind CSS | Docker

