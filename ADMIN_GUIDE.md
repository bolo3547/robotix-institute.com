# Admin Dashboard Guide

## Superadmin Access

The admin dashboard allows a superadmin to manage all website content including programs, testimonials, team members, and site settings.

## Login Credentials (Demo)

```
Email: admin@robotix.zm
Password: superadmin123
```

## Admin Dashboard Features

### 1. Dashboard Overview (`/admin`)
- Quick statistics showing students, programs, instructors, and satisfaction rate
- Quick access links to all management sections
- Quick action buttons for adding new content

### 2. Programs Management (`/admin/programs`)
**Features:**
- View all programs in a sortable list
- Add new programs with:
  - Program name
  - Age group
  - Difficulty level (Beginner/Intermediate/Advanced)
  - Price per month
  - Duration
- Edit existing programs
- Delete programs
- Real-time updates

**Example Program:**
- Name: Web Development Pro
- Age Group: 12-18 years
- Level: Advanced
- Price: 3,500 ZMW/month
- Duration: 10 weeks

### 3. Testimonials Management (`/admin/testimonials`)
**Features:**
- View all student/parent testimonials
- Add new testimonials with:
  - Parent name
  - Child name
  - Program name
  - Location
  - Star rating (1-5 stars)
  - Testimonial text
- Edit testimonials
- Delete testimonials
- Display star ratings

### 4. Team Management (`/admin/team`)
**Features:**
- View all team members
- Add new instructors/staff with:
  - Full name
  - Job role
  - Professional bio
  - Specialty/expertise
- Edit team member information
- Delete team members
- Display specialty badges

### 5. Website Settings (`/admin/settings`)
**Configure:**
- **General Settings:**
  - Site name
  - Tagline
  - Contact email
  - Phone number
  - Physical address
  
- **Social Media Links:**
  - Facebook URL
  - Instagram URL
  - LinkedIn URL
  - YouTube URL
  
- **Site Features:**
  - Maintenance mode toggle
  - Analytics tracking toggle

### 6. Pages & Content (`/admin/content`)
**Manage:**
- Homepage content
- About Us page
- Programs listing page
- Testimonials page
- Contact page
- What You Get page
- View editing history

## API Endpoints

The admin panel uses the following API endpoints:

### Programs
- `GET /api/admin/programs` - Get all programs
- `POST /api/admin/programs` - Create new program
- `PUT /api/admin/programs` - Update program
- `DELETE /api/admin/programs?id=1` - Delete program

### Testimonials
- `GET /api/admin/testimonials` - Get all testimonials
- `POST /api/admin/testimonials` - Create new testimonial
- `PUT /api/admin/testimonials` - Update testimonial
- `DELETE /api/admin/testimonials?id=1` - Delete testimonial

### Team
- `GET /api/admin/team` - Get all team members
- `POST /api/admin/team` - Create new team member
- `PUT /api/admin/team` - Update team member
- `DELETE /api/admin/team?id=1` - Delete team member

## Security Features

1. **Admin Login Page** (`/auth/admin-login`)
   - Secure authentication
   - Protected routes
   - Session management

2. **Middleware Protection** (`src/middleware.ts`)
   - Automatically redirects unauthorized users to login
   - Protects all `/admin` routes

3. **Future Enhancements:**
   - Password hashing
   - Database integration
   - Role-based access control
   - Audit logging
   - Two-factor authentication

## Access Admin Dashboard

### To Access:
1. Navigate to `http://localhost:3000/auth/admin-login`
2. Enter demo credentials:
   - Email: admin@robotix.zm
   - Password: superadmin123
3. Click "Login to Dashboard"
4. You'll be redirected to the admin dashboard at `/admin`

### Dashboard URL
- Main Dashboard: `http://localhost:3000/admin`
- Programs: `http://localhost:3000/admin/programs`
- Testimonials: `http://localhost:3000/admin/testimonials`
- Team: `http://localhost:3000/admin/team`
- Settings: `http://localhost:3000/admin/settings`
- Content: `http://localhost:3000/admin/content`

## Features at a Glance

| Feature | Description | URL |
|---------|-------------|-----|
| Dashboard | Overview and quick stats | `/admin` |
| Programs | Add/Edit/Delete programs | `/admin/programs` |
| Testimonials | Manage student reviews | `/admin/testimonials` |
| Team | Manage instructors & staff | `/admin/team` |
| Settings | Configure site settings | `/admin/settings` |
| Content | Manage page content | `/admin/content` |
| Login | Superadmin login | `/auth/admin-login` |

## Making Changes to the Website

### To add a new program:
1. Go to Admin Dashboard → Programs
2. Click "+ Add Program"
3. Fill in program details
4. Click "Save Program"
5. Program will appear on `/programs` page

### To add a testimonial:
1. Go to Admin Dashboard → Testimonials
2. Click "+ Add Testimonial"
3. Enter parent name, child name, program, location, rating, and testimonial text
4. Click "Save Testimonial"
5. Testimonial will appear on `/testimonials` page

### To update team information:
1. Go to Admin Dashboard → Team
2. Click Edit on a team member
3. Update information
4. Click "Save Changes"
5. Changes appear on `/about` page

### To change website settings:
1. Go to Admin Dashboard → Settings
2. Update site name, contact info, social media links
3. Configure features (maintenance mode, analytics)
4. Click "Save All Settings"

## Development Notes

- The admin panel uses **Framer Motion** for smooth animations
- All pages are built with **Next.js 14 App Router**
- **TypeScript** is used for type safety
- **Tailwind CSS** provides styling
- Currently uses **in-memory storage** (data resets on server restart)

## Production Deployment

For production, implement:
1. Database integration (MongoDB, PostgreSQL, etc.)
2. Proper authentication with JWT tokens
3. Password hashing (bcrypt)
4. Rate limiting
5. Audit logging
6. Backup and recovery systems
7. Two-factor authentication
8. Role-based access control (RBAC)

---

**Last Updated:** February 2024  
**Admin Panel Version:** 1.0  
**Status:** Development
