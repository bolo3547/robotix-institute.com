# ROBOTIX Platform - Dashboard Documentation

## Overview

The ROBOTIX Institute platform now includes **two comprehensive dashboards**:
- **Parent Dashboard** - For parents to monitor their children's learning progress
- **Instructor Dashboard** - For teachers to manage classes and track student progress

---

## Dashboard Features

### 1. Parent Dashboard (`/dashboard/parent`)

#### Features:
- **Course Tracking**: Monitor child's progress across multiple courses
  - Robotics Foundations (🤖) - 68% complete
  - Python for Kids (💻) - 42% complete
  - Game Creator (🎮) - 12% complete
  - Advanced Robotics (🦾) - 4% complete

- **Course Progress Visualization**
  - Visual progress bars for each course
  - Next lesson information
  - Course difficulty levels (Beginner, Intermediate, Advanced)
  - Quick access buttons: Continue & Details

- **Achievements & Badges**
  - Track earned badges (Rookie Builder, Code Starter)
  - View locked achievements (Competition Ready, Team Leader)
  - Motivational milestone tracking

- **Project Gallery**
  - View all submitted projects
  - Projects by category (Robotics, Game, Coding)
  - Project showcase with visual indicators

- **Learning Insights**
  - Total lessons completed: 24
  - Current learning streak: 7 days
  - Average performance: 94%

- **Parent Actions**
  - Download comprehensive reports
  - Send messages to instructors
  - View detailed progress analysis

#### Components Used:
```tsx
- motion (Framer Motion) - Smooth animations
- Card component - For content sections
- Button component - For interactions
- Progress bars - Visual course tracking
```

---

### 2. Instructor Dashboard (`/dashboard/instructor`)

#### Features:
- **Quick Statistics**
  - Active Classes: 3
  - Total Students: 30
  - Average Performance: 87%
  - Pending Messages: 5

- **Class Management**
  - Robotics Foundations (Beginner) - 12 students
  - Advanced Robotics (Advanced) - 8 students
  - Python for Kids (Intermediate) - 10 students
  - Quick access to class materials
  - Schedule view of upcoming classes

- **Student Progress Tracking**
  - Individual student performance metrics
  - Progress bars for each student
  - Status indicators:
    - ✅ On Track
    - 🚀 Exceeding
    - ⚠️ Needs Support

- **Recent Activity Feed**
  - Lesson completions
  - Badge achievements
  - Project submissions
  - Lesson starts
  - Timeline of student activities

- **Instructor Actions**
  - Create new assignments
  - Generate performance reports
  - Send personalized messages to students

#### Components Used:
```tsx
- motion (Framer Motion) - Smooth animations
- Card component - For content sections
- Button component - For interactions
- Progress bars - Visual student tracking
- Icons (Lucide) - Activity indicators
```

---

## Route Structure

```
/dashboard
├── /                    → Dashboard selector page
├── /parent              → Parent dashboard
└── /instructor          → Instructor dashboard
```

---

## Components Used

### From UI Library:
- **Button** (`@/components/ui/Button`)
  - Variants: `primary`, `outline`, `ghost`
  
- **Card** (`@/components/ui/Card`)
  - Container for content sections
  - Supports hover effects and transitions

### From Libraries:
- **framer-motion** - For smooth animations and transitions
- **lucide-react** - For icons (BookOpen, Users, Trophy, etc.)
- **Next.js Link** - For client-side navigation

---

## Styling

Both dashboards use:
- **Tailwind CSS** for responsive design
- **Gradient backgrounds** for visual appeal
- **Color schemes**:
  - Parent Dashboard: Blue and purple gradients
  - Instructor Dashboard: Indigo and purple gradients
- **Responsive grid layouts** (1 column mobile, 2+ columns desktop)
- **Smooth animations** with Framer Motion

---

## Sample Data

### Parent Dashboard Sample Data:
```javascript
{
  childName: "Zainab",
  courses: [
    { id: 1, name: "Robotics Foundations", progress: 68%, level: "Beginner" },
    { id: 2, name: "Python for Kids", progress: 42%, level: "Intermediate" },
    // ... more courses
  ],
  achievements: [
    { name: "Rookie Builder", status: "Earned" },
    { name: "Code Starter", status: "Earned" },
    // ... more achievements
  ]
}
```

### Instructor Dashboard Sample Data:
```javascript
{
  instructorName: "Thomas Kafwimbi",
  classes: [
    { id: 1, name: "Robotics Foundations", students: 12, level: "Beginner" },
    { id: 2, name: "Advanced Robotics", students: 8, level: "Advanced" },
    // ... more classes
  ],
  students: [
    { id: 1, name: "Zainab Chanda", progress: 68%, status: "On Track" },
    // ... more students
  ]
}
```

---

## Getting Started

### Run Development Server:
```bash
npm run dev
```

### Access Dashboards:
1. Navigate to `http://localhost:3000/dashboard`
2. Click on either "Parent Dashboard" or "Instructor Dashboard"
3. Or go directly to:
   - Parent: `http://localhost:3000/dashboard/parent`
   - Instructor: `http://localhost:3000/dashboard/instructor`

---

## Features Implemented

✅ **Parent Dashboard**
- [x] Course progress tracking
- [x] Achievement/badge system
- [x] Project gallery
- [x] Learning insights
- [x] Download reports functionality
- [x] Contact instructor messaging
- [x] Responsive design
- [x] Smooth animations

✅ **Instructor Dashboard**
- [x] Class management
- [x] Student progress tracking
- [x] Quick statistics cards
- [x] Recent activity feed
- [x] Create assignment functionality
- [x] Generate reports functionality
- [x] Student messaging
- [x] Responsive design
- [x] Smooth animations

---

## Future Enhancements

- [ ] Integration with backend API for real data
- [ ] Database connectivity for persistent data
- [ ] Real-time notifications
- [ ] Student/class management modals
- [ ] Advanced analytics and charts
- [ ] File upload for assignments
- [ ] Video lesson integration
- [ ] Mobile app version

---

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ✅ Responsive design

---

## Performance

- Both dashboards are optimized with:
  - Client-side rendering for instant interaction
  - Lazy animations (Framer Motion)
  - Responsive images and icons
  - Efficient Tailwind CSS
  - No external API calls (using sample data)

---

## Support & Feedback

For issues or feature requests regarding the dashboards, please contact the ROBOTIX development team.

© 2026 ROBOTIX INSTITUTE. All rights reserved. Built with ❤️ for Zambia.
