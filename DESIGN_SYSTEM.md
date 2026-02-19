# ROBOTIX Design System

A comprehensive, production-ready design system built with Tailwind CSS and Shadcn/UI. Designed to support multiple user roles with kid-friendly and professional variants ensuring consistency across all dashboards.

## Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Typography](#typography)
4. [Color Palette](#color-palette)
5. [Components](#components)
6. [Usage Examples](#usage-examples)
7. [Role-Based Theming](#role-based-theming)
8. [Best Practices](#best-practices)

---

## Overview

The ROBOTIX Design System provides a unified, scalable framework for building user interfaces across multiple platforms and user roles. It includes:

- **15+ pre-designed components** with multiple variants
- **Dual color palettes** (kid-friendly and professional)
- **Complete typography scale** from display to caption
- **Role-based theming** for parents, children, instructors, and admins
- **Accessibility compliance** (WCAG 2.1 AA)
- **Mobile-first responsive design**

### Design Tokens Location

All design tokens are defined in: [`src/styles/design-tokens.ts`](src/styles/design-tokens.ts)

### Components Location

UI components are located in: [`src/components/ui/`](src/components/ui/)

---

## Design Philosophy

### Principles

1. **Consistency**: All components follow the same visual language
2. **Accessibility**: WCAG 2.1 AA compliant with semantic HTML
3. **Flexibility**: Multiple variants support different contexts
4. **Clarity**: Clear visual hierarchy and information architecture
5. **Playfulness**: Kid-friendly variants are engaging without being chaotic
6. **Professionalism**: Admin/instructor interfaces are clean and data-focused

### Target Users

- **Parents/Guardians**: Bright, playful, easy to use
- **Children**: Colorful, engaging, safe environment
- **Instructors**: Clean, functional, focused on efficiency
- **Admins**: Dark theme, data-dense, powerful tools

---

## Typography

### Type Scale

The typography system uses a **modular scale** for visual hierarchy:

```
Display Large    → 3.5rem (56px) - Hero sections
Display Medium   → 2.8rem (44.8px)
Display Small    → 2.25rem (36px)

Heading 1        → 2rem (32px)    - Page titles
Heading 2        → 1.5rem (24px)  - Section headings
Heading 3        → 1.25rem (20px) - Subsections
Heading 4        → 1.125rem (18px)

Body Large       → 1.125rem (18px) - Lead text
Body             → 1rem (16px)     - Default text
Body Small       → 0.875rem (14px) - Secondary text

Label            → 0.875rem (14px) - Form labels
Caption          → 0.75rem (12px)  - Small UI text

Mono             → 0.875rem (14px) - Code, monospace
```

### Font Families

```javascript
// Default sans-serif
font-family: 'Inter', system-ui, sans-serif;

// Display/Headings
font-family: 'Poppins', system-ui, sans-serif;

// Code/Technical
font-family: 'Fira Code', monospace;
```

### Font Weights

- **400** - Regular text
- **500** - Labels, form text
- **600** - Subheadings, emphasis
- **700** - Headings, bold text

### Letter Spacing

- **Xs/Sm**: `0.01em` - Tighter for small text
- **Base/Lg**: `0.005em` - Standard spacing
- **Display**: `-0.02em` - Tighter for large headings

### Usage Example

```tsx
// Display headings
<h1 className="text-6xl font-bold leading-tight">
  Welcome to ROBOTIX
</h1>

// Page title
<h2 className="text-4xl font-bold text-slate-900">
  Dashboard Overview
</h2>

// Section heading
<h3 className="text-2xl font-semibold text-slate-900">
  Recent Activity
</h3>

// Body text
<p className="text-base text-slate-600 leading-relaxed">
  Regular paragraph content here.
</p>

// Caption/Small text
<span className="text-xs text-slate-500">
  Last updated: Just now
</span>
```

---

## Color Palette

### Primary Colors

#### Kid-Friendly (Blue)
Used for parent and child interfaces - bright, playful, and engaging.

```
50:  #E3F2FD - Lightest (backgrounds)
100: #BBDEFB
200: #90CAF9
300: #64B5F6
400: #42A5F5
500: #2196F3 ← Primary
600: #1E88E5
700: #1976D2
800: #1565C0
900: #0D47A1 - Darkest (text)
```

#### Professional (Indigo)
Used for instructor and admin interfaces - sophisticated and trustworthy.

```
50:  #F0F4FF - Lightest (backgrounds)
100: #E8EEFF
200: #D9E0FF
300: #BFC7FF
400: #A8B5FF
500: #6366F1 ← Primary
600: #4F46E5
700: #4338CA
800: #3730A3
900: #312E81 - Darkest (text)
```

### Secondary Colors

#### Kid-Friendly (Purple)
```
500: #9C27B0 ← Secondary
```

#### Professional (Purple)
```
500: #8B5CF6 ← Secondary
```

### Semantic Colors

```javascript
// Success - Green
50:  #E8F5E9
500: #4CAF50
700: #388E3C

// Warning - Amber
50:  #FFF3E0
500: #FF9800
700: #F57C00

// Error/Danger - Red
50:  #FFEBEE
500: #F44336
700: #D32F2F

// Info - Cyan
50:  #E1F5FE
500: #03A9F4
700: #0288D1
```

### Neutral/Grayscale

```javascript
50:  #FAFAFA - Almost white
100: #F5F5F5
200: #EEEEEE
300: #E0E0E0
400: #BDBDBD
500: #9E9E9E - Mid-gray
600: #757575
700: #616161
800: #424242
900: #212121 - Almost black
```

### Usage Example

```tsx
// Using semantic colors
<div className="bg-success-50 text-success-700 border border-success-200">
  ✓ Successfully completed
</div>

// Using primary colors
<button className="bg-primary-pro-500 text-white hover:bg-primary-pro-600">
  Submit
</button>

// Using neutral colors
<p className="text-neutral-600">
  Secondary text
</p>
```

---

## Components

### Button

Multiple variants for different contexts and user roles.

#### Variants

```typescript
// Professional variants
variant="default"       // Solid indigo
variant="secondary"     // Outline indigo
variant="ghost"         // Transparent

// Kid-friendly variants
variant="kidPrimary"    // Solid blue with shadow
variant="kidSecondary"  // Outline blue
variant="kidGhost"      // Transparent blue

// Semantic variants
variant="destructive"   // Red
variant="success"       // Green
variant="warning"       // Amber
```

#### Sizes

```typescript
size="xs"      // 1.75rem (28px)
size="sm"      // 2rem (32px)
size="md"      // 2.5rem (40px)
size="lg"      // 3rem (48px)
size="xl"      // 3.5rem (56px)
size="icon"    // 2.5rem × 2.5rem square
size="icon-sm" // 2rem × 2rem square
size="icon-lg" // 3rem × 3rem square
```

#### Examples

```tsx
import { Button } from '@/components/ui';

// Professional button
<Button variant="default" size="lg" fullWidth>
  Sign In
</Button>

// Kid-friendly button with loading state
<Button variant="kidPrimary" size="md" loading>
  Creating Project...
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Icons.Settings />
</Button>

// Semantic button
<Button variant="success">
  Save Changes
</Button>
```

---

### Card

Flexible container for content with multiple variants.

#### Variants

```typescript
variant="default"    // Light shadow, white background
variant="kid"        // Playful shadow, blue border
variant="elevated"    // Strong shadow, no border
variant="outlined"    // Border only, no shadow
variant="surface"     // Light gray background
```

#### Components

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

// Complete card structure
<Card variant="default">
  <CardHeader>
    <CardTitle>Dashboard Overview</CardTitle>
    <CardDescription>Your learning progress</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content here */}
  </CardContent>
  <CardFooter>
    {/* Action buttons */}
  </CardFooter>
</Card>

// Kid-friendly card
<Card variant="kid">
  <CardTitle>🎉 Achievements</CardTitle>
  {/* Content */}
</Card>
```

---

### Badge

Small status indicators, role labels, and tags.

#### Variants

**Status Badges:**
```typescript
variant="active"       // Green
variant="inactive"     // Gray
variant="pending"      // Amber
variant="completed"    // Green
```

**Role Badges:**
```typescript
variant="parent"       // Blue (kid-friendly)
variant="child"        // Purple (kid-friendly)
variant="instructor"   // Indigo (professional)
variant="admin"        // Slate (professional)
```

**Level Badges:**
```typescript
variant="beginner"     // Cyan
variant="intermediate" // Amber
variant="advanced"     // Red
```

**Semantic Badges:**
```typescript
variant="success"      // Green
variant="warning"      // Amber
variant="error"        // Red
variant="info"         // Blue
```

#### Sizes

```typescript
size="sm"  // 0.75rem text
size="md"  // 0.875rem text (default)
size="lg"  // 1rem text
```

#### Examples

```tsx
import { Badge } from '@/components/ui';

// Status badge
<Badge variant="active">Active</Badge>

// Role badge
<Badge variant="instructor">Instructor</Badge>

// Level badge with icon
<Badge variant="advanced" icon={<Trophy />}>
  Advanced
</Badge>

// Custom size
<Badge variant="success" size="lg">
  ✓ Completed
</Badge>
```

---

### Alert

Message boxes for important information, warnings, and feedback.

#### Variants

```typescript
variant="success"    // Green - Positive feedback
variant="warning"    // Amber - Caution messages
variant="error"      // Red - Error messages
variant="info"       // Blue - Informational
variant="playful"    // Blue - Kid-friendly alerts
```

#### Components

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui';
```

#### Examples

```tsx
// Simple alert
<Alert variant="success">
  Your progress has been saved!
</Alert>

// Alert with title and description
<Alert variant="warning">
  <AlertTitle>Maintenance Notice</AlertTitle>
  <AlertDescription>
    The platform will be under maintenance from 2-3 PM tomorrow.
  </AlertDescription>
</Alert>

// Alert with custom icon and dismiss
<Alert
  variant="info"
  icon={<Bell />}
  onDismiss={() => setShowAlert(false)}
>
  <AlertTitle>New Achievement Unlocked</AlertTitle>
  <AlertDescription>
    You've completed the "Robotics Basics" module!
  </AlertDescription>
</Alert>

// Playful kid-friendly alert
<Alert variant="playful">
  🎉 Great job! You've earned 50 points!
</Alert>
```

---

### Input

Text input fields with consistent styling.

```tsx
import { Input } from '@/components/ui';

<Input
  type="text"
  placeholder="Enter your name"
  className="rounded-lg"
/>

<Input
  type="email"
  placeholder="your@email.com"
  disabled
/>
```

---

## Usage Examples

### Complete Form

```tsx
'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Alert,
  Badge,
  Input,
} from '@/components/ui';

export function SignUpForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-md mx-auto p-4">
      {submitted && (
        <Alert variant="success" className="mb-4">
          ✓ Account created successfully!
        </Alert>
      )}

      <Card variant="kid">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>Join ROBOTIX today!</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <Input placeholder="John Doe" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input type="email" placeholder="john@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Role
            </label>
            <div className="flex gap-2">
              <Badge variant="parent">Parent</Badge>
              <Badge variant="child">Child</Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="kidPrimary" fullWidth onClick={() => setSubmitted(true)}>
            Create Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

### Dashboard Status Panel

```tsx
import { Card, CardHeader, CardTitle, CardContent, Badge, Alert } from '@/components/ui';

export function StatusPanel() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          System Status
          <Badge variant="active">Operational</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
          <span>Database</span>
          <Badge variant="success" size="sm">✓ Connected</Badge>
        </div>

        <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
          <span>API Server</span>
          <Badge variant="success" size="sm">✓ Running</Badge>
        </div>

        <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
          <span>Email Service</span>
          <Badge variant="warning" size="sm">⚠ Degraded</Badge>
        </div>

        <Alert variant="warning" className="mt-4">
          Email delivery may be delayed. We're investigating.
        </Alert>
      </CardContent>
    </Card>
  );
}
```

---

## Role-Based Theming

The design system supports role-specific themes ensuring the right visual experience for each user type.

### Theme Mapping

```typescript
// Parent - Kid-friendly blue theme
{
  primary: COLORS.primary.kid,
  secondary: COLORS.secondary.kid,
  theme: 'light',
}

// Child - Playful purple theme
{
  primary: COLORS.primary.kid,
  secondary: COLORS.secondary.kid,
  theme: 'light',
}

// Instructor - Professional indigo theme
{
  primary: COLORS.primary.pro,
  secondary: COLORS.secondary.pro,
  theme: 'light',
}

// Admin - Professional dark theme
{
  primary: COLORS.primary.pro,
  secondary: COLORS.secondary.pro,
  theme: 'dark',
  background: '#111827',
  surface: '#1F2937',
}
```

### Applying Themes

```tsx
'use client';

import { useSession } from 'next-auth/react';
import { ROLE_THEMES } from '@/styles/design-tokens';

export function ThemedLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const role = session?.user?.role as keyof typeof ROLE_THEMES;
  const theme = ROLE_THEMES[role] || ROLE_THEMES.parent;

  return (
    <div
      className={`${theme.theme === 'dark' ? 'dark' : ''}`}
      style={{
        '--primary-color': theme.primary[500],
        '--secondary-color': theme.secondary[500],
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
```

---

## Best Practices

### 1. Use Design Tokens Consistently

```tsx
// ✅ Good - Uses design system colors
<Button variant="kidPrimary">
  Click Me
</Button>

// ❌ Bad - Hardcoded colors
<button style={{ backgroundColor: '#2196F3' }}>
  Click Me
</button>
```

### 2. Respect Semantic Colors

```tsx
// ✅ Good - Uses semantic meaning
<Alert variant="success">
  Operation completed!
</Alert>

// ❌ Bad - Misused colors
<Alert variant="error">
  Operation completed!
</Alert>
```

### 3. Maintain Visual Hierarchy

```tsx
// ✅ Good - Clear hierarchy
<h1 className="text-6xl font-bold">Main Title</h1>
<h2 className="text-3xl font-semibold mt-4">Section</h2>
<p className="text-base text-neutral-600 mt-2">Content</p>

// ❌ Bad - Confused hierarchy
<h1 className="text-base">Main Title</h1>
<h2 className="text-lg">Section</h2>
```

### 4. Use Variants Over Custom Classes

```tsx
// ✅ Good - Component variant
<Button variant="kidPrimary" size="lg">
  Action
</Button>

// ❌ Bad - Custom styling
<Button className="bg-blue-500 text-white px-6 py-3">
  Action
</Button>
```

### 5. Ensure Accessibility

```tsx
// ✅ Good - Semantic HTML with labels
<label htmlFor="email">Email</label>
<Input id="email" type="email" aria-describedby="email-help" />

// ✅ Good - Icon buttons have labels
<Button size="icon" aria-label="Settings">
  <Settings />
</Button>

// ❌ Bad - Missing labels
<input type="email" />
<button><Settings /></button>
```

### 6. Responsive Design

```tsx
// ✅ Good - Mobile-first responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>

// ✅ Good - Responsive text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>
```

### 7. Color Contrast

Ensure minimum WCAG AA compliance (4.5:1 for text):

```tsx
// ✅ Good - High contrast
<p className="text-neutral-900 bg-white">Dark text on light</p>
<p className="text-white bg-primary-pro-600">Light text on dark</p>

// ❌ Bad - Low contrast
<p className="text-neutral-400 bg-neutral-100">Light gray on very light gray</p>
```

---

## Design Tokens Import

Access all design tokens in your components:

```tsx
import {
  TYPOGRAPHY,
  COLORS,
  SPACING,
  COMPONENT_SIZES,
  SHADOWS,
  BORDER_RADIUS,
  ANIMATIONS,
  ROLE_THEMES,
  BADGE_VARIANTS,
  ALERT_VARIANTS,
  BUTTON_VARIANTS,
} from '@/styles/design-tokens';

// Example usage
const primaryColor = COLORS.primary.kid[500];
const spacing = SPACING[4]; // 1rem
const shadow = SHADOWS.lg;
```

---

## Responsive Design

### Breakpoints

```typescript
sm: '640px'   // Small devices
md: '768px'   // Tablets
lg: '1024px'  // Large tablets/small laptops
xl: '1280px'  // Laptops/desktops
2xl: '1536px' // Large desktops
```

### Mobile-First Approach

```tsx
// Start with mobile, then add larger screens
<div className="text-sm md:text-base lg:text-lg">
  Responsive text size
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <Card>Responsive grid</Card>
  {/* ... more cards ... */}
</div>
```

---

## Component Showcase

A complete component showcase page is available at `/design-system` demonstrating all components, variants, and patterns in action.

---

## Support & Maintenance

### Adding New Components

1. Create component file in `src/components/ui/`
2. Use CVA (class-variance-authority) for variants
3. Export from `src/components/ui/index.ts`
4. Document in this guide
5. Add to showcase page

### Updating Design Tokens

1. Edit `src/styles/design-tokens.ts`
2. Update Tailwind config if adding new colors/sizes
3. Update this documentation
4. Test across all dashboards

---

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [CVA Documentation](https://cva.style/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Version History

- **v1.0.0** (Feb 2026) - Initial design system release
  - Button, Card, Badge, Alert components
  - Dual color palettes (kid-friendly & professional)
  - Complete typography scale
  - Role-based theming
  - WCAG 2.1 AA compliance
