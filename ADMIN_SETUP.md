# ROBOTIX Admin Dashboard - Complete Setup Guide

## 🎯 Overview

A complete **superadmin dashboard** has been created for managing all website content including:
- ✅ Programs (add/edit/delete)
- ✅ Testimonials (manage reviews)
- ✅ Team Members (manage instructors)
- ✅ Website Settings (configure site)
- ✅ Content Pages (manage all pages)

## 🔐 Admin Login

### Access URL
```
http://localhost:3000/auth/admin-login
```

### Demo Credentials
```
Email:    admin@robotix.zm
Password: superadmin123
```

### After Login
You'll be redirected to the main admin dashboard:
```
http://localhost:3000/admin
```

## 📊 Admin Dashboard Features

### 1. Main Dashboard (`/admin`)
- **Quick Stats:** See 2,500+ students, 7 programs, 4 instructors, 95% satisfaction
- **Management Sections:** Quick access to all content management areas
- **Quick Actions:** Fast buttons to add programs, testimonials, team members, view content

### 2. Programs Management (`/admin/programs`)
Manage all robotics and coding programs:
- View all 7 programs in a list
- **Add Program:** Create new programs with:
  - Program name
  - Age group (e.g., "12-18 years")
  - Level (Beginner/Intermediate/Advanced)
  - Price per month (e.g., "3,500 ZMW/month")
  - Duration (e.g., "10 weeks")
- **Edit Programs:** Click the pencil icon to modify
- **Delete Programs:** Click the trash icon to remove
- Real-time updates

**Current Programs:**
- Robotics Foundations (6-8 years, Beginner, 2,500 ZMW)
- Coding Basics (7-10 years, Beginner, 3,000 ZMW)
- Python Programming (10-14 years, Intermediate, 4,000 ZMW)
- Digital Skills (8-12 years, Beginner, 2,000 ZMW)
- Advanced Robotics (11-16 years, Advanced, 4,500 ZMW)
- Web Development Pro (12-18 years, Advanced, 3,500 ZMW)
- AI & Machine Learning (13-18 years, Advanced, 4,500 ZMW)

### 3. Testimonials Management (`/admin/testimonials`)
Manage student and parent reviews:
- View all testimonials with star ratings
- **Add Testimonial:** Create new reviews with:
  - Parent name
  - Child name
  - Program name
  - Location
  - Star rating (1-5 stars)
  - Testimonial text
- **Edit Testimonials:** Modify existing reviews
- **Delete Testimonials:** Remove reviews
- Star ratings display prominently

### 4. Team Management (`/admin/team`)
Manage instructors and staff:
- View all team members
- **Add Team Member:** Add instructors/staff with:
  - Full name
  - Job role/title
  - Professional biography
  - Specialty/expertise area
- **Edit Members:** Update team information
- **Delete Members:** Remove team members
- Display specialty badges

**Current Team:**
- Dr. Chileshe Mwale (Founder & Director)
- Linda Banda (Head of Curriculum)
- Thomas Kafwimbi (Lead Instructor - Robotics)
- Grace Nkonde (Lead Instructor - Programming)

### 5. Website Settings (`/admin/settings`)
Configure all website information:

**General Settings:**
- Site name (default: "ROBOTIX Institute")
- Tagline (default: "Transforming STEM Education in Zambia")
- Contact email
- Phone number
- Physical address

**Social Media Links:**
- Facebook URL
- Instagram URL
- LinkedIn URL
- YouTube URL

**Site Features:**
- Toggle maintenance mode
- Enable/disable analytics tracking

### 6. Pages & Content Management (`/admin/content`)
View and manage all website pages:
- Homepage
- About Us
- Programs
- Testimonials
- Contact
- What You Get Today

Each page shows its sections and last edited date.

## 🔗 Navigation Integration

### Admin Link in Header
An admin button has been added to the main website header:
- Click the "⚙️ Admin" button in the top navigation
- Or go directly to `/auth/admin-login`
- Enter demo credentials to access the dashboard

## 📱 Admin Panel URLs

| Feature | URL |
|---------|-----|
| Admin Login | `/auth/admin-login` |
| Dashboard | `/admin` |
| Programs | `/admin/programs` |
| Testimonials | `/admin/testimonials` |
| Team | `/admin/team` |
| Settings | `/admin/settings` |
| Content | `/admin/content` |

## 🛡️ Security Features

### Authentication
- ✅ Admin login page with email/password
- ✅ Demo credentials for testing
- ✅ Protected routes (redirects to login if not authenticated)

### Middleware Protection
- ✅ All `/admin` routes are protected
- ✅ Automatic redirect to login for unauthorized access
- ✅ Session management with tokens

### Future Security Enhancements Needed
1. Password hashing (bcrypt)
2. Database integration
3. Two-factor authentication
4. Role-based access control (RBAC)
5. Audit logging
6. IP whitelisting

## 🔧 API Endpoints

The admin panel communicates with these backend APIs:

### Programs API
```
GET    /api/admin/programs          - Get all programs
POST   /api/admin/programs          - Create new program
PUT    /api/admin/programs          - Update program
DELETE /api/admin/programs?id=1     - Delete program
```

### Testimonials API
```
GET    /api/admin/testimonials      - Get all testimonials
POST   /api/admin/testimonials      - Create new testimonial
PUT    /api/admin/testimonials      - Update testimonial
DELETE /api/admin/testimonials?id=1 - Delete testimonial
```

### Team API
```
GET    /api/admin/team              - Get all team members
POST   /api/admin/team              - Create new team member
PUT    /api/admin/team              - Update team member
DELETE /api/admin/team?id=1         - Delete team member
```

## 💾 Data Storage

Currently, the admin panel uses **in-memory storage**, which means:
- ✅ Changes work during the development session
- ⚠️ Data resets when the server restarts
- ⚠️ Data is not persistent

For production, implement:
1. **Database Integration** (MongoDB, PostgreSQL, MySQL, etc.)
2. **Data Persistence** (save to database)
3. **Backup Systems** (regular backups)
4. **Version History** (track changes)

## 🚀 How to Use the Admin Panel

### Quick Start
1. Open your dev server: `npm run dev`
2. Navigate to `http://localhost:3000/auth/admin-login`
3. Login with demo credentials
4. Start managing your content!

### Adding a Program
1. Go to **Programs** section
2. Click **"+ Add Program"**
3. Fill in the form:
   - Name: "Mobile App Development"
   - Age Group: "14-16 years"
   - Level: "Intermediate"
   - Price: "3,800 ZMW/month"
   - Duration: "9 weeks"
4. Click **"Save Program"**
5. Program appears in the list and on the website

### Adding a Testimonial
1. Go to **Testimonials** section
2. Click **"+ Add Testimonial"**
3. Fill in the form:
   - Parent Name: "John Banda"
   - Child Name: "Grace"
   - Program: "Python Programming"
   - Location: "Kitwe"
   - Rating: "5 Stars"
   - Text: "Excellent program! My son loves it!"
4. Click **"Save Testimonial"**
5. Testimonial appears on the website with star rating

### Adding a Team Member
1. Go to **Team** section
2. Click **"+ Add Team Member"**
3. Fill in the form:
   - Name: "Jane Smith"
   - Role: "Lead Instructor - Web Development"
   - Specialty: "Full-Stack Development"
   - Bio: "8 years of experience in web development..."
4. Click **"Save Member"**
5. Team member appears on the About page

### Updating Settings
1. Go to **Settings** section
2. Update any of:
   - Site name, tagline, email, phone, address
   - Social media links
   - Feature toggles
3. Click **"Save All Settings"**
4. Changes take effect immediately

## 📚 File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx              # Dashboard
│   │   ├── programs/page.tsx      # Programs management
│   │   ├── testimonials/page.tsx  # Testimonials management
│   │   ├── team/page.tsx          # Team management
│   │   ├── settings/page.tsx      # Settings
│   │   └── content/page.tsx       # Content pages
│   ├── auth/
│   │   └── admin-login/page.tsx   # Admin login page
│   └── api/admin/
│       ├── programs/route.ts      # Programs API
│       ├── testimonials/route.ts  # Testimonials API
│       └── team/route.ts          # Team API
├── components/
│   └── layout/Header.tsx          # Updated with admin link
└── middleware.ts                  # Admin route protection
```

## 🎨 Design System Integration

The admin panel uses:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide Icons** for icons
- **Custom Button & Card components** from the design system
- **Dark theme** (gray-900 background) for reduced eye strain

## 🐛 Troubleshooting

### Can't access admin dashboard?
1. Make sure the dev server is running: `npm run dev`
2. Clear browser cookies/cache
3. Try incognito/private browsing mode
4. Check if you're logged in at `/auth/admin-login`

### Changes not appearing?
1. Refresh the page
2. Clear browser cache
3. Check if the dev server is still running
4. Restart the dev server: `npm run dev`

### Data disappearing after refresh?
This is expected! The in-memory storage resets when the server restarts.
To make it persistent, integrate a database.

## 🔄 Next Steps

To make the admin panel fully production-ready:

### Immediate (High Priority)
1. ✅ Set up database (MongoDB, PostgreSQL, etc.)
2. ✅ Implement proper authentication (JWT)
3. ✅ Add password hashing (bcrypt)
4. ✅ Move data from in-memory to database
5. ✅ Add admin user management

### Medium Priority
1. ✅ Image upload functionality
2. ✅ Rich text editor for descriptions
3. ✅ Drag-and-drop ordering
4. ✅ Bulk actions
5. ✅ Search and filtering

### Long-term (Nice to Have)
1. ✅ Analytics dashboard
2. ✅ Email notifications
3. ✅ Backup automation
4. ✅ Two-factor authentication
5. ✅ Role-based access control

## 📞 Support

For questions or issues with the admin panel:
1. Check the ADMIN_GUIDE.md for more details
2. Review the component files in src/app/admin/
3. Check API route files in src/app/api/admin/

---

**Admin Panel Version:** 1.0  
**Status:** Ready for Development  
**Last Updated:** February 2024
