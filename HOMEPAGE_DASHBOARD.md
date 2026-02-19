# Kid-Friendly Dashboard — Quick Guide

This dashboard is a playful, accessible learning interface for ages 6–18.

Files added:
- `src/components/dashboard/ProgressBar.tsx`
- `src/components/dashboard/Badge.tsx`
- `src/components/dashboard/CourseCard.tsx`
- `src/components/dashboard/ProjectGallery.tsx`
- `src/components/dashboard/AchievementsPanel.tsx`
- `src/components/dashboard/DashboardLayout.tsx`
- `src/app/dashboard/page.tsx` (demo page)

How to view locally:

```bash
cd "c:\Users\DENUEL\Desktop\ROBOTIX INSTITUTE ZM\robotix-platform"
npm install --legacy-peer-deps
npm run dev
# Open http://localhost:3000/dashboard
```

Customization:
- Add or edit courses in `src/app/dashboard/page.tsx` sampleCourses array.
- Add achievements in `sampleAchievements`.
- Project thumbnails can be added by setting `thumbnail` on project entries.
- CourseCard uses the `ProgressBar` component. Adjust style via Tailwind classes.

Accessibility & design notes:
- Buttons are large and keyboard accessible.
- Progress bars use `role="progressbar"` and aria attributes.
- Animations use `framer-motion` and are subtle; avoid rapid flashing.
- No ads or external chat integrations are included.

If you want, I can:
- Wire the dashboard to the real backend APIs
- Add per-course lesson pages
- Create a smaller kids-only UI variant

