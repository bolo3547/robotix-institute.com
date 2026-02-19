# Design System Quick Reference

## Quick Start

### Importing Components

```tsx
// From main export
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Input,
} from '@/components/ui';

// From design tokens
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  ROLE_THEMES,
} from '@/styles/design-tokens';
```

## Component Variants at a Glance

### Button Variants

| Variant | Use Case | Example |
|---------|----------|---------|
| `default` | Professional primary action | Sign In button |
| `secondary` | Secondary action | Cancel button |
| `ghost` | Minimal action | Navigation links |
| `kidPrimary` | Kid-friendly primary | Play button for child |
| `success` | Success/confirm | Save Changes |
| `destructive` | Dangerous action | Delete account |

### Button Sizes

```tsx
size="xs"      // 28px - Compact UI
size="sm"      // 32px - Secondary buttons
size="md"      // 40px - Default size
size="lg"      // 48px - Primary buttons
size="xl"      // 56px - Hero buttons
size="icon"    // 40x40px square
```

### Card Variants

```tsx
variant="default"   // Light shadow, white bg - Most common
variant="kid"       // Blue border, playful shadow - For children
variant="elevated"  // Strong shadow - Highlight sections
variant="outlined"  // Border only - Minimal style
variant="surface"   // Light gray bg - Secondary content
```

### Badge Variants

**Status:**
```tsx
variant="active"      // Green - Active state
variant="inactive"    // Gray - Disabled state
variant="pending"     // Amber - Waiting
variant="completed"   // Green - Done
```

**Role:**
```tsx
variant="parent"      // Blue - Parent/guardian
variant="child"       // Purple - Student
variant="instructor"  // Indigo - Teacher
variant="admin"       // Slate - Administrator
```

**Level:**
```tsx
variant="beginner"      // Cyan
variant="intermediate"  // Amber
variant="advanced"      // Red
```

### Alert Variants

```tsx
variant="success"   // Green - Positive feedback
variant="warning"   // Amber - Caution
variant="error"     // Red - Error messages
variant="info"      // Blue - Information
variant="playful"   // Blue - Kid-friendly alerts
```

## Color Palette Quick Ref

### Primary Colors

**Kid-Friendly (Blue):**
- Light: `#BBDEFB` (100)
- Main: `#2196F3` (500)
- Dark: `#1E88E5` (600)

**Professional (Indigo):**
- Light: `#E8EEFF` (100)
- Main: `#6366F1` (500)
- Dark: `#4F46E5` (600)

### Semantic Colors

```
Success (Green):    #4CAF50
Warning (Amber):    #FF9800
Error (Red):        #F44336
Info (Cyan):        #03A9F4
```

## Common Patterns

### Form Input Group

```tsx
<div className="space-y-2">
  <label htmlFor="email" className="block text-sm font-medium">
    Email
  </label>
  <Input
    id="email"
    type="email"
    placeholder="your@email.com"
  />
  <p className="text-xs text-slate-500">
    We'll never share your email
  </p>
</div>
```

### Status Card

```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex justify-between items-center">
      Status
      <Badge variant="active">Active</Badge>
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Action Buttons Row

```tsx
<CardFooter className="gap-2">
  <Button variant="outline" onClick={onCancel}>
    Cancel
  </Button>
  <Button onClick={onSave}>
    Save
  </Button>
</CardFooter>
```

### Success Message

```tsx
<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your changes have been saved.
  </AlertDescription>
</Alert>
```

### Role-Based Styling

```tsx
// For parent interface
<Button variant="kidPrimary">Approve Request</Button>

// For admin interface
<Button variant="default">Approve Request</Button>

// For instructor
<Button variant="secondary">Add Comment</Button>
```

## Spacing Shortcuts

```typescript
const spacing = {
  'gap-2': '0.5rem',      // 8px - Compact
  'gap-3': '0.75rem',     // 12px - Cozy
  'gap-4': '1rem',        // 16px - Comfortable
  'gap-6': '1.5rem',      // 24px - Spacious
  'gap-8': '2rem',        // 32px - Very spacious
  'p-4': '1rem',          // Padding 16px
  'px-6': '1.5rem',       // Horizontal 24px
  'py-3': '0.75rem',      // Vertical 12px
}
```

## Responsive Breakpoints

```tsx
// Mobile-first approach
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>

// Available breakpoints
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Accessibility Checklist

- ✅ Use semantic HTML (`<button>`, `<h1>`, `<nav>`)
- ✅ Add `aria-label` to icon buttons
- ✅ Link labels to inputs with `htmlFor`
- ✅ Ensure 4.5:1 color contrast ratio
- ✅ Test keyboard navigation (Tab, Enter, Escape)
- ✅ Provide focus indicators
- ✅ Use ARIA roles when needed

## Common Issues & Solutions

### Issue: Button text too small on mobile

```tsx
// ❌ Bad
<Button>Click</Button>

// ✅ Good
<Button className="text-sm md:text-base">Click</Button>
```

### Issue: Card content overflowing

```tsx
// ✅ Good
<Card className="overflow-hidden">
  <CardContent className="overflow-x-auto">
    {/* Scrollable content */}
  </CardContent>
</Card>
```

### Issue: Badge alignment in table

```tsx
// ✅ Good
<td className="inline-flex items-center">
  <Badge variant="active">Active</Badge>
</td>
```

## Design Tokens Usage

```tsx
import { COLORS, SPACING, COMPONENT_SIZES } from '@/styles/design-tokens';

// Access specific colors
const primaryColor = COLORS.primary.kid[500];
const successBg = COLORS.accent.success[50];

// Use spacing scale
const spacing = SPACING[4]; // '1rem'

// Get component sizes
const buttonSize = COMPONENT_SIZES.button.md;
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 10+)

## Performance Tips

1. **Avoid inline styles** - Use Tailwind classes
2. **Use CSS variables** - For theme switching
3. **Load fonts efficiently** - Already optimized in config
4. **Lazy load images** - Use Next.js Image component
5. **Minimize custom CSS** - Rely on Tailwind utilities

## Testing Components

Access the complete showcase at: `http://localhost:3000/design-system`

All components are interactive and demonstrate:
- All variants
- All sizes
- Loading states
- Disabled states
- Responsive behavior
- Accessibility features

## Need Help?

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for:
- Complete component documentation
- Detailed usage examples
- Best practices
- Design philosophy
- Accessibility guidelines

---

**Last Updated:** Feb 2026  
**Version:** 1.0.0
