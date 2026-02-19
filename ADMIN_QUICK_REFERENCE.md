# ROBOTIX Admin Dashboard - Quick Reference

## 🚀 Quick Access

| Link | URL | Purpose |
|------|-----|---------|
| Admin Login | `http://localhost:3000/auth/admin-login` | Superadmin authentication |
| Dashboard | `http://localhost:3000/admin` | Main admin panel |
| Programs | `http://localhost:3000/admin/programs` | Manage courses |
| Testimonials | `http://localhost:3000/admin/testimonials` | Manage reviews |
| Team | `http://localhost:3000/admin/team` | Manage staff |
| Settings | `http://localhost:3000/admin/settings` | Configure site |
| Content | `http://localhost:3000/admin/content` | Manage pages |

## 🔐 Login Credentials (Demo)

```
Email:    admin@robotix.zm
Password: superadmin123
```

## 📋 What You Can Do

### ✅ Add Programs
- Program name, age group, level, price, duration
- Button: Dashboard → "+ Add Program" or Programs → "+ Add Program"

### ✅ Edit Programs
- Click the edit icon on any program card
- Update and save changes

### ✅ Delete Programs
- Click the trash icon on any program
- Confirm deletion

### ✅ Add Testimonials
- Parent name, child name, program, location, stars, text
- Button: Dashboard → "+ Add Testimonial" or Testimonials → "+ Add Testimonial"

### ✅ Edit Testimonials
- Click the edit icon on testimonial
- Update and save

### ✅ Delete Testimonials
- Click the trash icon
- Confirm deletion

### ✅ Add Team Members
- Name, role, specialty, biography
- Button: Dashboard → "+ Add Team Member" or Team → "+ Add Team Member"

### ✅ Edit Team Members
- Click the edit icon
- Update and save

### ✅ Delete Team Members
- Click the trash icon
- Confirm deletion

### ✅ Configure Settings
- Site name, email, phone, address
- Social media links
- Feature toggles (maintenance mode, analytics)
- Button: Settings → "Save All Settings"

## 🎯 Common Tasks

### To Change Website Title
1. Go to Settings
2. Update "Site Name" field
3. Click "Save All Settings"

### To Update Contact Info
1. Go to Settings
2. Update Email, Phone, Address fields
3. Click "Save All Settings"

### To Add Social Media Links
1. Go to Settings
2. Scroll to "Social Media Links"
3. Update Facebook, Instagram, LinkedIn, YouTube URLs
4. Click "Save All Settings"

### To Enable/Disable Maintenance Mode
1. Go to Settings
2. Toggle "Maintenance Mode" checkbox
3. Click "Save All Settings"
4. Website becomes inaccessible to visitors when enabled

## 🎨 Dashboard Stats

The main dashboard shows:
- **2,500+** Total Students
- **7** Active Programs
- **4** Instructors
- **95%** Satisfaction Rate

These update as you add/remove items.

## 📱 Mobile Friendly

All admin pages are responsive:
- ✅ Desktop: Full layout with side panels
- ✅ Tablet: Optimized grid layout
- ✅ Mobile: Single column, full-width

## 🔄 Data Storage

⚠️ **Important:** Data is stored in memory
- Changes persist during current session
- Data resets when server restarts
- For persistence, integrate a database

## 🛠️ Keyboard Shortcuts

| Action | Method |
|--------|--------|
| Go Back | Click back arrow or browser back button |
| Save | Click "Save" button or press Enter in forms |
| Cancel | Click "Cancel" button |
| Edit | Click pencil icon (✏️) |
| Delete | Click trash icon (🗑️) |

## ⚡ Quick Navigation

**From Dashboard:**
- Programs Section → Click Programs card or "+ Add Program"
- Testimonials Section → Click Testimonials card or "+ Add Testimonial"
- Team Section → Click Team card or "+ Add Team Member"
- Settings → Click Settings card
- Content → Click Pages & Content card

**From Any Admin Page:**
- Click "← Back to Dashboard" in header
- Click ROBOTIX Admin logo to go home

## 🎯 Best Practices

✅ **Do:**
- Keep program information accurate and up-to-date
- Add genuine testimonials from real parents/students
- Include professional photos for team members
- Update settings when contact information changes
- Regularly backup important data

❌ **Don't:**
- Share login credentials with unauthorized people
- Leave maintenance mode enabled (site becomes inaccessible)
- Add duplicate programs
- Use profane language in testimonials
- Forget to save changes

## 📊 Fields Required

### Program
- ✓ Name (required)
- ✓ Age Group (required)
- ✓ Level (required)
- ✓ Price (required)
- ✓ Duration (required)

### Testimonial
- ✓ Parent Name (required)
- ✓ Child Name (required)
- ✓ Program (required)
- ✓ Location (required)
- ✓ Rating (required)
- ✓ Text (required)

### Team Member
- ✓ Full Name (required)
- ✓ Role (required)
- ✓ Specialty (required)
- ✓ Biography (required)

### Settings
- ✓ Site Name (required)
- ✓ Email (required)
- ✓ Phone (required)
- ✓ Address (required)

## 🔐 Security Notes

🔒 **Current Security:**
- ✅ Login page (email/password)
- ✅ Protected routes
- ✅ Session tokens

🔐 **Future Enhancements:**
- Two-factor authentication
- Password complexity requirements
- Account lockout after failed attempts
- Audit logging
- IP whitelisting

## 🆘 Need Help?

1. **Forgot Password?** (Development Feature)
   - Contact the developer
   - Use demo credentials (will be replaced in production)

2. **Data Not Saving?**
   - Check browser console for errors
   - Ensure dev server is running
   - Try refreshing the page

3. **Can't Login?**
   - Verify credentials are correct
   - Clear browser cookies
   - Try incognito mode

4. **Can't Find Something?**
   - Use back button to navigate
   - Click dashboard to reset
   - Refresh the page

## 📞 Support Contacts

- **Technical Issues:** Check ADMIN_GUIDE.md
- **Feature Requests:** Contact development team
- **Security Concerns:** Notify administrator immediately

---

**Quick Ref Version:** 1.0  
**Last Updated:** February 2024  
**Admin Panel Status:** ✅ Ready to Use
