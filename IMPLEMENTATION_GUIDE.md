# ROBOTIX INSTITUTE Platform - Implementation Guide

This guide will help you complete the build and deploy the production-ready EdTech platform.

## 📋 Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure Overview](#project-structure-overview)
3. [Adding Database](#adding-database)
4. [API Implementation](#api-implementation)
5. [Authentication System](#authentication-system)
6. [Deployment](#deployment)
7. [Testing](#testing)
8. [Monitoring](#monitoring)

---

## Development Setup

### 1. Clone and Install

```bash
cd robotix-platform
npm install
```

### 2. Environment Setup

```bash
# Copy the example file
cp .env.example .env.local

# Fill in your values:
# - JWT_SECRET: Generate with: openssl rand -base64 32
# - Database URL: postgresql://user:password@localhost:5432/robotix
# - Email: Gmail with App Password
# - AWS/Stripe: Fill in when you have them
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app running.

---

## Project Structure Overview

### Frontend Pages

```
src/app/
├── page.tsx                    # Landing page (HOME)
├── auth/
│   ├── login/page.tsx         # Login page
│   ├── signup/page.tsx        # Signup page
│   └── forgot-password/        # Password reset (TODO)
├── dashboard/                  # Role-based dashboards
│   ├── parent/page.tsx        # Parent dashboard
│   ├── child/page.tsx         # Child dashboard
│   ├── instructor/page.tsx    # Instructor dashboard
│   └── admin/page.tsx         # Admin dashboard
├── programs/
│   ├── page.tsx               # Programs listing
│   └── [id]/page.tsx          # Program detail page
├── profile/                    # User profile pages
│   ├── page.tsx               # View profile
│   └── edit/page.tsx          # Edit profile
└── api/                        # Backend API routes (TO IMPLEMENT)
    ├── auth/
    ├── users/
    ├── programs/
    ├── enrollments/
    └── dashboard/
```

### Components

```
src/components/
├── ui/                         # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── ... (add more as needed)
├── layout/
│   ├── Header.tsx             # Navigation
│   └── Footer.tsx
├── landing/                    # Homepage sections
│   ├── HeroSection.tsx
│   ├── ProgramsSection.tsx
│   ├── TrustSection.tsx
│   ├── TestimonialsSection.tsx
│   └── CTASection.tsx
└── dashboard/                  # Dashboard components (TODO)
    ├── ParentDashboard.tsx
    ├── ChildDashboard.tsx
    ├── InstructorDashboard.tsx
    └── AdminDashboard.tsx
```

---

## Adding Database

### Step 1: Set Up PostgreSQL

**Local Development:**
```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Linux
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

### Step 2: Create Database

```bash
createdb robotix_db
createuser robotix_user
# Set password when prompted
```

### Step 3: Install Prisma

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

### Step 4: Create Prisma Schema

Create `prisma/schema.prisma`:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String
  password  String
  role      Role       @default(PARENT)
  avatar    String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  // Relations
  asParent   Parent?
  asChild    Child?
  asInstructor Instructor?
  asAdmin    Admin?
  notifications Notification[]
  
  @@map("users")
}

enum Role {
  PARENT
  CHILD
  INSTRUCTOR
  ADMIN
}

model Parent {
  id                String     @id @default(cuid())
  userId            String     @unique
  user              User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  phone             String
  emergencyContact  String?
  children          Child[]
  preferences       String?    // JSON
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt

  @@map("parents")
}

model Child {
  id               String       @id @default(cuid())
  userId           String       @unique
  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  parentId         String
  parent           Parent       @relation(fields: [parentId], references: [id], onDelete: Cascade)
  dateOfBirth      DateTime
  enrollments      Enrollment[]
  grades           Grade[]
  achievements     StudentAchievement[]
  safetySettings   String?      // JSON
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  @@map("children")
}

model Instructor {
  id             String       @id @default(cuid())
  userId         String       @unique
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  bio            String?
  qualifications String?      // JSON array
  certifications String?      // JSON array
  programs       Program[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@map("instructors")
}

model Admin {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  permissions String?  // JSON array
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("admins")
}

model Program {
  id               String         @id @default(cuid())
  name             String
  description      String
  ageGroup         String
  level            String
  image            String?
  duration         Int            // weeks
  sessionsPerWeek  Int
  maxStudents      Int
  instructorId     String
  instructor       Instructor     @relation(fields: [instructorId], references: [id])
  price            Float
  curriculum       String?        // JSON
  learningOutcomes String?        // JSON array
  prerequisites    String?        // JSON array
  schedule         String?        // JSON
  enrollments      Enrollment[]
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  @@map("programs")
}

model Enrollment {
  id            String       @id @default(cuid())
  childId       String
  child         Child        @relation(fields: [childId], references: [id], onDelete: Cascade)
  programId     String
  program       Program      @relation(fields: [programId], references: [id], onDelete: Cascade)
  enrollmentDate DateTime    @default(now())
  status        String       @default("active") // active, completed, cancelled, paused
  progress      Int          @default(0)
  attendance    String?      // JSON array
  grades        Grade[]
  payments      Payment[]
  completionDate DateTime?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@map("enrollments")
}

model Grade {
  id             String   @id @default(cuid())
  childId        String
  child          Child    @relation(fields: [childId], references: [id], onDelete: Cascade)
  enrollmentId   String
  enrollment     Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  assessmentId   String
  score          Int
  maxScore       Int
  feedback       String?
  submissionDate DateTime @default(now())
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("grades")
}

model Payment {
  id              String   @id @default(cuid())
  enrollmentId    String
  enrollment      Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  amount          Float
  currency        String   @default("ZMW")
  status          String   @default("pending") // pending, completed, failed, refunded
  paymentMethod   String   // credit_card, bank_transfer, mobile_money
  transactionId   String?  @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("payments")
}

model Achievement {
  id             String @id @default(cuid())
  name           String
  description    String
  icon           String
  criteria       String
  points         Int
  studentAchievements StudentAchievement[]

  @@map("achievements")
}

model StudentAchievement {
  id            String   @id @default(cuid())
  childId       String
  child         Child    @relation(fields: [childId], references: [id], onDelete: Cascade)
  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)
  unlockedDate  DateTime @default(now())
  points        Int
  createdAt     DateTime @default(now())

  @@map("student_achievements")
}

model Notification {
  id       String   @id @default(cuid())
  userId   String
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type     String   // announcement, grade, attendance, achievement, reminder
  title    String
  message  String
  read     Boolean  @default(false)
  actionUrl String?
  createdAt DateTime @default(now())

  @@map("notifications")
}

model Testimonial {
  id         String   @id @default(cuid())
  authorName String
  authorRole String   // parent, child, instructor
  authorImage String?
  rating     Int      // 1-5
  text       String
  childName  String?
  programName String?
  createdAt  DateTime @default(now())
  verified   Boolean  @default(false)

  @@map("testimonials")
}

model Contact {
  id       String   @id @default(cuid())
  name     String
  email    String
  phone    String?
  subject  String
  message  String
  type     String   // inquiry, feedback, support
  status   String   @default("new") // new, in_review, resolved
  createdAt DateTime @default(now())

  @@map("contacts")
}
```

### Step 5: Run Migrations

```bash
npx prisma migrate dev --name init
```

This creates your database tables.

### Step 6: Add Prisma Client to Your App

Create `src/lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## API Implementation

### Step 1: Create Auth API Routes

Create `src/app/api/auth/login/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user);

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

Create `src/app/api/auth/signup/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role.toUpperCase(),
      },
    });

    // Create role-specific record
    if (role === 'parent') {
      await prisma.parent.create({
        data: {
          userId: user.id,
          phone: '',
        },
      });
    }

    // Generate token
    const token = generateToken(user);

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 2: Create Programs API

Create `src/app/api/programs/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const programs = await prisma.program.findMany({
      include: {
        instructor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
```

### Step 3: Create Dashboard APIs

Create `src/app/api/dashboard/parent/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get parent data
    const parent = await prisma.parent.findUnique({
      where: { userId: decoded.id },
      include: {
        children: {
          include: {
            enrollments: {
              include: {
                program: true,
                grades: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(parent);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Authentication System

### Implementing JWT Middleware

Create `src/lib/middleware.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Attach user to request
    (request as any).user = decoded;
    return handler(request);
  };
}

export function withRole(...allowedRoles: string[]) {
  return (handler: Function) => {
    return async (request: NextRequest) => {
      const token = request.headers.get('Authorization')?.split(' ')[1];

      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      if (!decoded || !allowedRoles.includes(decoded.role)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      (request as any).user = decoded;
      return handler(request);
    };
  };
}
```

---

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
# ... add all from .env.local

# Run migrations on production
vercel env add DATABASE_MIGRATE "true"
```

### Option 2: Self-Hosted (VPS)

```bash
# 1. Build
npm run build

# 2. Start
npm start

# 3. Use PM2 for process management
npm i -g pm2
pm2 start npm --name "robotix" -- start
pm2 save
pm2 startup

# 4. Use Nginx as reverse proxy
# Create /etc/nginx/sites-available/robotix
server {
    listen 80;
    server_name robotixinstitute.io www.robotixinstitute.io;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Testing

### Unit Tests

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

Run tests:
```bash
npm test
```

---

## Monitoring

### Sentry for Error Tracking

```bash
npm install @sentry/nextjs
```

Initialize in `next.config.js` and monitor your application.

---

## What's Ready, What's Next

### ✅ Completed
- Stunning landing page with trust signals
- Authentication UI (login/signup)
- Component library
- Database schema
- Type definitions
- Security headers

### 🔄 Next Steps (Priority Order)

1. **Implement Database** - Use Prisma schema provided
2. **Complete Auth APIs** - Login/signup endpoints
3. **Build Parent Dashboard** - Core value prop
4. **Implement Programs API** - List and detail pages
5. **Stripe Integration** - Enable payments
6. **Email System** - Notifications to parents
7. **Instructor Dashboard** - Attendance, grades
8. **Analytics** - Track conversions
9. **Mobile App** - React Native version
10. **Live Classes** - Zoom/Google Meet integration

---

## Quick References

### Key Files Modified
- `src/types/index.ts` - All TypeScript types
- `src/constants/index.ts` - App-wide constants
- `src/lib/auth.ts` - Authentication utilities
- `src/lib/rbac.ts` - Access control
- `tailwind.config.ts` - Styling config
- `next.config.js` - Next.js optimization

### Important Commands
```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run start       # Run production build
npm run type-check  # Type checking
npm run lint        # Linting
npm test            # Run tests
```

---

**Need help? Check the README.md and explore the component structure. Everything is well-documented!**
