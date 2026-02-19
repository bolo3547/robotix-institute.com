# ROBOTIX Multi-Dashboard Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        ROBOTIX PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser   │  │   Browser   │  │   Browser   │          │
│  │  (Parent)   │  │ (Instructor)│  │   (Admin)   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                  │
│         └─────────────────┼─────────────────┘                  │
│                           │                                    │
│                    ┌──────▼──────┐                             │
│                    │  Next.js    │                             │
│                    │  App Router │                             │
│                    └──────┬──────┘                             │
│                           │                                    │
│         ┌─────────────────┼─────────────────┐                 │
│         │                 │                 │                 │
│    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐             │
│    │  Login  │      │Middleware│      │ API    │             │
│    │  Page   │      │  (Auth)  │      │ Routes │             │
│    └────┬────┘      └────┬────┘      └────┬────┘             │
│         │                 │                 │                 │
│    ┌────▼──────────────────┼─────────────────┴────┐           │
│    │      NextAuth.js      │   Secure Layer     │           │
│    │  JWT + Credentials    │                     │           │
│    └────┬──────────────────┼────────────────────┘           │
│         │                 │                                   │
│    ┌────▼────┐      ┌────▼──────────┐                        │
│    │  Users  │      │ Role-Based    │                        │
│    │Database │      │ Middleware    │                        │
│    └─────────┘      └────┬──────────┘                        │
│                          │                                    │
│         ┌────────────────┼────────────────┐                  │
│         │                │                │                  │
│    ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐            │
│    │ Parent   │    │ Instructor│    │ Admin    │            │
│    │ Dashboard│    │ Dashboard│    │ Dashboard│            │
│    └──────────┘    └──────────┘    └──────────┘            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Diagram

```
User Login Form
    │
    ▼
┌─────────────────────────────────────┐
│  Email + Password submitted         │
│  (signIn() from NextAuth/react)     │
└──────────────┬──────────────────────┘
               │
               ▼
    ┌─────────────────────────────────┐
    │ NextAuth Credentials Provider   │
    │ /api/auth/[...nextauth]         │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │ Password Verification (bcryptjs)│
    │ - Hash comparison               │
    │ - Validation                    │
    └──────────────┬───────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ✅ Valid            ❌ Invalid
        │                     │
    ┌───▼────────┐        ┌──▼─────────────┐
    │ Generate   │        │ Return Error   │
    │ JWT Token  │        │ Message        │
    └───┬────────┘        └────────────────┘
        │
    ┌───▼─────────────────────────┐
    │ Session Callback:           │
    │ - Inject role into token    │
    │ - Inject user ID            │
    └───┬─────────────────────────┘
        │
    ┌───▼──────────────────────────┐
    │ Store in HttpOnly Cookie     │
    │ 24-hour expiration           │
    └───┬──────────────────────────┘
        │
    ┌───▼──────────────────────────┐
    │ Redirect to Role Dashboard   │
    │ - /parent-dashboard          │
    │ - /instructor-dashboard      │
    │ - /admin-dashboard           │
    └──────────────────────────────┘
```

---

## Route Protection Flow

```
User Accesses URL
    │
    ▼
┌────────────────────────────────────────┐
│ middleware.ts Intercepts Request       │
└────────┬──────────────────────────────┘
         │
    ┌────┴────────────────────────────────┐
    │                                     │
    ▼                                     ▼
Public Route?                   Protected Route?
    │                                     │
YES │                                NO   │
    │                                     │
┌───▼──────────────┐               ┌────▼─────────────┐
│ Allow Access     │               │ Check JWT Token │
└──────────────────┘               └────┬────────────┘
                                        │
                           ┌────────────┴─────────────┐
                           │                         │
                       ✅ Token Found             ❌ No Token
                           │                         │
                        ┌──▼──┐              ┌──────▼────────┐
                        │ ✓   │              │ Redirect to  │
                        │     │              │ /auth/login  │
                        └──┬──┘              └──────────────┘
                           │
                    ┌──────▼──────────┐
                    │ Verify Role    │
                    │ vs Route       │
                    └──┬──────────┬──┘
                       │          │
                   ✅ Match    ❌ Mismatch
                       │          │
                    ┌──▼─┐   ┌────▼─────────────┐
                    │✓   │   │ Redirect to     │
                    │    │   │ /auth/unauthorized│
                    └────┘   └─────────────────┘
```

---

## Component Architecture

### Parent Dashboard Components

```
ParentDashboardLayout
├── Header (with Notifications)
├── Sidebar Navigation
└── Main Content
    ├── Key Metrics (4 cards)
    ├── ChildProfile
    │   ├── Profile Image
    │   ├── Child Info
    │   └── Stats Cards
    ├── ProgressTracking
    │   ├── Skill Progress Bars
    │   └── Achievements Grid
    ├── Charts Section
    │   ├── AttendanceChart (Bar)
    │   └── SkillsDistribution (Pie)
    ├── AttendanceRecords (Table)
    ├── InstructorFeedback (Cards)
    ├── PaymentHistory (Table)
    └── Footer
```

### Instructor Dashboard Components

```
InstructorDashboardLayout
├── Header (with Create Lesson button)
├── Sidebar Navigation
└── Main Content
    ├── Key Metrics (4 cards)
    ├── ClassList (Grid)
    │   ├── Class Cards
    │   ├── Progress Bars
    │   └── Action Buttons
    ├── StudentList (Compact)
    │   └── Student Status Cards
    ├── PerformanceAnalytics
    │   ├── Trend Line Chart
    │   └── Skills Bar Chart
    └── Footer
```

### Admin Dashboard Components

```
AdminDashboardLayout (Dark Theme)
├── Header (with Add User button)
├── Sidebar Navigation
└── Main Content
    ├── KPI Cards (4)
    ├── UserManagement Table
    │   ├── User Actions
    │   └── Role Badges
    ├── SystemHealth (Status Cards)
    ├── FinancialOverview
    │   ├── Summary Cards
    │   ├── Revenue Chart
    │   └── Payment Methods Chart
    ├── RecentActivity Timeline
    └── Footer
```

---

## Data Flow Model

### Parent Dashboard Data Flow

```
useSession() Hook
    │
    ├─ Get user session
    ├─ Verify JWT token
    └─ Extract user role
    
    ▼
Check Authorization
    ├─ Compare role with 'parent'
    └─ Redirect if unauthorized
    
    ▼
Fetch Child Data (Future)
    ├─ API call: /api/parent/child
    ├─ Get progress data
    ├─ Get attendance data
    └─ Get feedback data
    
    ▼
Render Components
    ├─ ChildProfile (static data)
    ├─ ProgressTracking (progress data)
    ├─ AttendanceRecords (attendance data)
    ├─ InstructorFeedback (feedback data)
    ├─ PaymentHistory (payment data)
    └─ Notifications (activity data)
    
    ▼
User Interactions
    ├─ View/filter data
    ├─ Sign out
    └─ Navigate between sections
```

---

## Security Architecture

### Authentication Layer

```
┌─────────────────────────────────────────────────┐
│           Credentials Provider                  │
│  (Email + Password based Authentication)        │
└────────────────┬────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │  User DB       │
         │ (Mock Users)   │
         └────────────────┘

Password Flow:
  plaintext → bcryptjs.compare() → hashed → match check → JWT token
```

### Authorization Layer

```
┌─────────────────────────────────────────────────┐
│        Next.js Middleware (Edge)                │
│  - Validate JWT on every request               │
│  - Check token expiration                      │
│  - Verify role matches route                   │
└────────────────┬────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │  JWT Payload   │
         │  {             │
         │   role: user   │
         │   id: uuid     │
         │   exp: time    │
         │  }             │
         └────────────────┘

Protected Routes:
  /parent-dashboard → Middleware checks role === 'parent'
  /instructor-dashboard → Middleware checks role === 'instructor'
  /admin-dashboard → Middleware checks role === 'admin'
```

### Session Management

```
┌──────────────────────────────────────────┐
│  NextAuth Session Configuration          │
├──────────────────────────────────────────┤
│ Strategy: JWT                            │
│ Max Age: 24 hours                        │
│ Storage: HttpOnly Cookies                │
│ Refresh: On page load                    │
│ Secure: HTTPS only (production)          │
└──────────────────────────────────────────┘
```

---

## Database Schema (Future Implementation)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('parent', 'student', 'instructor', 'admin'),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEXES: email, role
);
```

### Children Table
```sql
CREATE TABLE children (
  id UUID PRIMARY KEY,
  parent_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  profile_image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEXES: parent_id
);
```

### Progress Table
```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY,
  child_id UUID REFERENCES children(id),
  skill VARCHAR(100),
  progress_value INT (0-100),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEXES: child_id, skill
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES users(id),
  class_id UUID,
  attended BOOLEAN,
  date DATE,
  INDEXES: student_id, class_id, date
);
```

### Feedback Table
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES users(id),
  instructor_id UUID REFERENCES users(id),
  content TEXT,
  rating INT (1-5),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEXES: student_id, instructor_id
);
```

---

## API Routes (Phase 2)

### Authentication Endpoints

```
POST /api/auth/register
  ├─ Input: { email, password, name, role }
  ├─ Validation: Email format, password strength
  ├─ Hash password with bcryptjs
  └─ Return: { user, token }

POST /api/auth/[...nextauth]
  ├─ Credentials Provider
  ├─ Password verification
  └─ JWT token generation

POST /api/auth/logout
  ├─ Clear session
  └─ Return: { success }
```

### Parent API Endpoints

```
GET /api/parent/child
  ├─ Auth: Verify parent role
  ├─ Query: child_id
  └─ Return: { child details }

GET /api/parent/progress
  ├─ Auth: Verify parent role
  ├─ Query: child_id
  └─ Return: { progress data }

GET /api/parent/attendance
  ├─ Auth: Verify parent role
  ├─ Query: child_id, start_date, end_date
  └─ Return: { attendance records }

GET /api/parent/feedback
  ├─ Auth: Verify parent role
  ├─ Query: child_id
  └─ Return: { feedback list }

GET /api/parent/payments
  ├─ Auth: Verify parent role
  ├─ Query: child_id
  └─ Return: { payment history }
```

### Instructor API Endpoints

```
GET /api/instructor/classes
  ├─ Auth: Verify instructor role
  └─ Return: { assigned classes }

GET /api/instructor/students
  ├─ Auth: Verify instructor role
  ├─ Query: class_id
  └─ Return: { students in class }

POST /api/instructor/feedback
  ├─ Auth: Verify instructor role
  ├─ Input: { student_id, content, rating }
  └─ Return: { feedback record }

GET /api/instructor/analytics
  ├─ Auth: Verify instructor role
  ├─ Query: class_id, period
  └─ Return: { class analytics }
```

### Admin API Endpoints

```
GET /api/admin/users
  ├─ Auth: Verify admin role
  └─ Return: { all users paginated }

POST /api/admin/users
  ├─ Auth: Verify admin role
  ├─ Input: { user data }
  └─ Return: { created user }

PUT /api/admin/users/:id
  ├─ Auth: Verify admin role
  └─ Return: { updated user }

DELETE /api/admin/users/:id
  ├─ Auth: Verify admin role
  └─ Return: { success }

GET /api/admin/analytics
  ├─ Auth: Verify admin role
  └─ Return: { platform analytics }
```

---

## Environment Variables

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Database (Phase 2)
DATABASE_URL=postgresql://user:password@localhost:5432/robotix

# Payment Gateway (Phase 2)
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...

# Email Service (Phase 2)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# AWS S3 (Phase 2)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
```

---

## Performance Optimization

### Code Splitting
```
- Each dashboard route: separate bundle
- Components: lazy loaded
- Images: optimized with next/image
```

### Caching Strategy
```
- Static pages: 3600 seconds
- API responses: 300 seconds
- Images: 86400 seconds
```

### Bundle Size
```
- Initial: ~150KB (gzipped)
- Per dashboard: ~50KB additional
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] HTTPS certificate installed
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Logging/monitoring setup
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance testing passed
- [ ] User acceptance testing done

---

## Monitoring & Logging

### Recommended Tools
- **APM**: New Relic, DataDog
- **Logging**: LogRocket, Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Monitoring**: Prometheus, Grafana

### Key Metrics to Track
- Page load time
- Authentication success rate
- API response time
- Error rate
- User session duration
- Device breakdown

---

**Version:** 1.0.0 Beta  
**Last Updated:** February 7, 2026  
**Status:** Ready for Phase 2 Development
