# Quick Start Guide - ROBOTIX INSTITUTE Platform

Get up and running in 5 minutes!

## 🚀 Installation

```bash
# 1. Navigate to project
cd c:\Users\DENUEL\Desktop\ROBOTIX\ INSTITUTE\ ZM\robotix-platform

# 2. Install dependencies
npm install

# 3. Copy environment file
copy .env.example .env.local

# 4. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

## 📱 Demo Credentials

### Login Page: http://localhost:3000/auth/login
```
Email: parent@demo.com
Password: password

(or any demo creds - currently accepts all for demo)
```

### Create Account: http://localhost:3000/auth/signup
- Select role: Parent or Instructor
- Fill in your details
- Password: min 8 characters

## 🎯 What to See

### Landing Page (/)
- ✅ Hero section with CTA
- ✅ Trust signals
- ✅ Programs showcase
- ✅ Real testimonials
- ✅ Call-to-action sections

### Authentication Pages
- ✅ Login form with demo credentials
- ✅ Multi-step signup process
- ✅ Form validation
- ✅ Trust badges

### Currently Not Functional (Backend Not Yet Implemented)
- ❌ Dashboard pages (will show after API implementation)
- ❌ Program enrollment
- ❌ Payment processing
- ❌ User profile pages

## 🛠️ Project Structure Quick Ref

```
robotix-platform/
├── src/
│   ├── app/              # Pages and routes
│   ├── components/       # Reusable React components
│   ├── lib/             # Utilities (auth, RBAC)
│   ├── types/           # TypeScript definitions
│   └── constants/       # App constants
├── public/              # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── README.md
└── IMPLEMENTATION_GUIDE.md
```

## 📋 What's Included

### ✅ Frontend (Complete)
- [x] Landing page with conversion optimization
- [x] Hero section with animations
- [x] Trust signals section
- [x] Programs showcase
- [x] Testimonials section
- [x] Call-to-action sections
- [x] Header navigation
- [x] Footer with links
- [x] Responsive design (mobile-first)
- [x] Accessibility (WCAG basics)
- [x] Login page
- [x] Signup page with role selection
- [x] UI component library (Button, Input, Card)
- [x] Framer Motion animations

### 🔄 Backend/API (Ready for Implementation)
- [x] TypeScript types for all models
- [x] Authentication logic (JWT)
- [x] RBAC implementation
- [x] Database schema (Prisma)
- [x] API route structure (ready to fill in)
- [ ] API endpoints (need to implement)
- [ ] Database connection (need to set up)
- [ ] Email notifications (configuration ready)
- [ ] Payment integration (structure ready)

### 🔐 Security (Implemented)
- [x] Security headers
- [x] SSL/HTTPS ready
- [x] Password hashing utilities
- [x] JWT token generation
- [x] Role-based access control
- [x] Input validation ready
- [x] CSRF protection (Next.js built-in)

## 🎨 Customization

### Change Colors
Edit `src/constants/index.ts` and `tailwind.config.ts`

### Update Content
- Homepage: `src/app/page.tsx`
- Hero: `src/components/landing/HeroSection.tsx`
- Programs: `src/components/landing/ProgramsSection.tsx`
- Testimonials: `src/components/landing/TestimonialsSection.tsx`

### Add New Components
```bash
# Example: Create a new button component
touch src/components/ui/NewComponent.tsx

# Add to app
import NewComponent from '@/components/ui/NewComponent'
```

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `src/types/index.ts` | All TypeScript types for the app |
| `src/lib/auth.ts` | Password hashing, JWT tokens |
| `src/lib/rbac.ts` | Role-based access control |
| `src/constants/index.ts` | App constants and configs |
| `tailwind.config.ts` | Tailwind CSS customization |
| `next.config.js` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |

## 🔄 Next Steps for Production

### Week 1-2: Database & Auth
```bash
npm install @prisma/client prisma
npm install bcryptjs jsonwebtoken
# Follow IMPLEMENTATION_GUIDE.md for setup
```

### Week 2-3: API Endpoints
- Implement `/api/auth/*` routes
- Implement `/api/programs/*` routes
- Implement `/api/enrollments/*` routes

### Week 3-4: Dashboard Pages
- Parent dashboard
- Child dashboard
- Instructor dashboard

### Week 4+: Advanced Features
- Payment processing
- Email notifications
- Live classes
- Analytics

## 🚢 Deployment

### Vercel (Fastest)
```bash
npm i -g vercel
vercel login
vercel
```

### Manual/VPS
```bash
npm run build
npm start
# Set up with PM2 and Nginx
```

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Framer Motion**: https://www.framer.com/motion/

## ✅ Development Checklist

Before going live:

- [ ] Change all demo credentials
- [ ] Update environment variables (JWT_SECRET, etc.)
- [ ] Set up PostgreSQL database
- [ ] Implement API endpoints
- [ ] Test all forms with real API
- [ ] Set up email service
- [ ] Implement payment processing
- [ ] Add Google Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Enable SSL certificate
- [ ] Configure CDN for images
- [ ] Set up domain and DNS
- [ ] Test on mobile devices
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] Security audit
- [ ] Load testing
- [ ] Create user documentation
- [ ] Set up monitoring/alerts

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Tailwind Classes Not Showing
```bash
# Clear cache and rebuild
npm run build
npm run dev
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm node_modules package-lock.json
npm install
```

## 📝 Notes

- **Demo Mode**: Currently accepts any login - implement real auth in phase 2
- **Database**: Schema included but not connected - see IMPLEMENTATION_GUIDE.md
- **API**: Routes created but need backend logic - see IMPLEMENTATION_GUIDE.md
- **Payments**: Stripe integration ready in constants
- **Email**: Nodemailer configured, needs API keys

## 🎉 Success!

You now have a production-ready frontend for the ROBOTIX INSTITUTE platform!

Next: Follow the IMPLEMENTATION_GUIDE.md to complete the backend.

---

**Questions?** Check README.md for detailed documentation.

**Ready to build?** Let's make ROBOTIX the best EdTech platform in Zambia! 🚀
