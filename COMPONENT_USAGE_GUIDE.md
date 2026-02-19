# Component Usage Guide

Complete examples and patterns for using each component in the ROBOTIX Design System.

## Table of Contents

1. [Button Component](#button)
2. [Card Component](#card)
3. [Badge Component](#badge)
4. [Alert Component](#alert)
5. [Common Patterns](#patterns)
6. [Accessibility](#accessibility)

---

## Button

### Basic Usage

```tsx
import { Button } from '@/components/ui';

// Professional button
<Button>Click Me</Button>

// Kid-friendly button
<Button variant="kidPrimary">Play Now</Button>

// Semantic button
<Button variant="success">Save</Button>
```

### All Variants

```tsx
// Professional
<Button variant="default">Default</Button>          // Solid indigo
<Button variant="secondary">Secondary</Button>      // Outline indigo
<Button variant="ghost">Ghost</Button>              // Transparent

// Kid-friendly
<Button variant="kidPrimary">Primary</Button>       // Solid blue
<Button variant="kidSecondary">Secondary</Button>   // Outline blue
<Button variant="kidGhost">Ghost</Button>           // Transparent blue

// Semantic
<Button variant="success">Success</Button>          // Green
<Button variant="warning">Warning</Button>          // Amber
<Button variant="destructive">Delete</Button>       // Red
```

### All Sizes

```tsx
<Button size="xs">Extra Small</Button>  {/* 28px */}
<Button size="sm">Small</Button>        {/* 32px */}
<Button size="md">Medium</Button>       {/* 40px - default */}
<Button size="lg">Large</Button>        {/* 48px */}
<Button size="xl">Extra Large</Button>  {/* 56px */}
```

### Icon Buttons

```tsx
import { Button } from '@/components/ui';
import { Bell, Settings, Heart } from 'lucide-react';

// Icon button (40x40px)
<Button variant="ghost" size="icon">
  <Bell className="w-5 h-5" />
</Button>

// Smaller icon button (32x32px)
<Button variant="kidPrimary" size="icon-sm">
  <Heart className="w-4 h-4" />
</Button>

// Larger icon button (48x48px)
<Button size="icon-lg">
  <Settings className="w-6 h-6" />
</Button>
```

### Loading State

```tsx
const [loading, setLoading] = useState(false);

<Button 
  loading={loading} 
  onClick={async () => {
    setLoading(true);
    // Perform action
    await saveData();
    setLoading(false);
  }}
>
  {loading ? 'Saving...' : 'Save'}
</Button>
```

### Full Width Button

```tsx
<Button fullWidth>
  Take Full Width
</Button>

// Often used in modals or mobile layouts
<div className="space-y-2">
  <Button fullWidth variant="default">
    Confirm
  </Button>
  <Button fullWidth variant="outline">
    Cancel
  </Button>
</div>
```

### Disabled State

```tsx
<Button disabled>
  Disabled Button
</Button>

// Conditional disable
<Button disabled={isLoading || !isFormValid}>
  Submit
</Button>
```

### With Icons and Text

```tsx
import { Plus, Download } from 'lucide-react';

<Button>
  <Plus className="w-4 h-4 mr-2" />
  Add Item
</Button>

<Button variant="outline">
  <Download className="w-4 h-4 mr-2" />
  Export
</Button>
```

---

## Card

### Basic Usage

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

### Complete Card Structure

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui';

<Card variant="default">
  <CardHeader>
    <CardTitle>Profile Settings</CardTitle>
    <CardDescription>Update your account information</CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
    {/* Form fields */}
  </CardContent>

  <CardFooter className="gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>
```

### All Variants

```tsx
// Default - Light shadow, white background
<Card variant="default">
  <CardTitle>Standard Card</CardTitle>
</Card>

// Kid-friendly - Playful shadow and blue border
<Card variant="kid">
  <CardTitle>🎉 Fun Card</CardTitle>
</Card>

// Elevated - Strong shadow, no border
<Card variant="elevated">
  <CardTitle>Important Section</CardTitle>
</Card>

// Outlined - Border only, minimal shadow
<Card variant="outlined">
  <CardTitle>Minimal Card</CardTitle>
</Card>

// Surface - Light gray background
<Card variant="surface">
  <CardTitle>Secondary Content</CardTitle>
</Card>
```

### Grid Layout with Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <Card key={item.id} variant="default">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {item.description}
      </CardContent>
    </Card>
  ))}
</div>
```

### Card with Image

```tsx
<Card>
  <div className="relative h-48 overflow-hidden rounded-t-lg">
    <Image
      src={imageUrl}
      alt={title}
      fill
      className="object-cover"
    />
  </div>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Description */}
  </CardContent>
</Card>
```

### Card with Status Badge

```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex justify-between items-center">
      <span>Task</span>
      <Badge variant="active">Active</Badge>
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Task details */}
  </CardContent>
</Card>
```

---

## Badge

### Status Badges

```tsx
import { Badge } from '@/components/ui';

<Badge variant="active">Active</Badge>
<Badge variant="inactive">Inactive</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="completed">Completed</Badge>
```

### Role Badges

```tsx
// Kid-friendly roles
<Badge variant="parent">Parent</Badge>
<Badge variant="child">Child</Badge>

// Professional roles
<Badge variant="instructor">Instructor</Badge>
<Badge variant="admin">Admin</Badge>
```

### Level Badges

```tsx
<Badge variant="beginner">Beginner</Badge>
<Badge variant="intermediate">Intermediate</Badge>
<Badge variant="advanced">Advanced</Badge>
```

### Semantic Badges

```tsx
<Badge variant="success">✓ Success</Badge>
<Badge variant="warning">⚠ Warning</Badge>
<Badge variant="error">✕ Error</Badge>
<Badge variant="info">ℹ Info</Badge>
```

### Badge Sizes

```tsx
<Badge size="sm">Small</Badge>     {/* 12px text */}
<Badge size="md">Medium</Badge>    {/* 14px text - default */}
<Badge size="lg">Large</Badge>     {/* 16px text */}
```

### Badges with Icons

```tsx
import { Trophy, AlertTriangle, CheckCircle2 } from 'lucide-react';

<Badge variant="advanced" icon={<Trophy className="w-3 h-3" />}>
  Expert
</Badge>

<Badge variant="warning" icon={<AlertTriangle className="w-3 h-3" />}>
  Caution
</Badge>

<Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
  Verified
</Badge>
```

### Badge in Tables

```tsx
<table>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>
        <Badge variant="active">Active</Badge>
      </td>
      <td>
        <Badge variant="intermediate">Intermediate</Badge>
      </td>
    </tr>
  </tbody>
</table>
```

### Dynamic Badges

```tsx
const getStatusBadge = (status: string) => {
  const variants: Record<string, any> = {
    'active': 'active',
    'inactive': 'inactive',
    'pending': 'pending',
    'completed': 'completed',
  };
  
  return <Badge variant={variants[status]}>{status}</Badge>;
};

// Usage
{getStatusBadge(userStatus)}
```

---

## Alert

### Basic Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui';

<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your changes have been saved.
  </AlertDescription>
</Alert>
```

### All Variants

```tsx
// Success - Green
<Alert variant="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed!</AlertDescription>
</Alert>

// Warning - Amber
<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Please review before proceeding.</AlertDescription>
</Alert>

// Error - Red
<Alert variant="error">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong. Please try again.</AlertDescription>
</Alert>

// Info - Blue
<Alert variant="info">
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>Check out our new features!</AlertDescription>
</Alert>

// Playful - Kid-friendly
<Alert variant="playful">
  🎉 Great job! You've completed the mission!
</Alert>
```

### Alert with Custom Icon

```tsx
import { AlertCircle, Bell } from 'lucide-react';

<Alert 
  variant="warning" 
  icon={<AlertCircle className="w-4 h-4" />}
>
  <AlertTitle>Maintenance</AlertTitle>
  <AlertDescription>Platform will be down 2-3 PM tomorrow.</AlertDescription>
</Alert>

<Alert 
  variant="info" 
  icon={<Bell className="w-4 h-4" />}
>
  <AlertTitle>New Notification</AlertTitle>
  <AlertDescription>You have a new message from your instructor.</AlertDescription>
</Alert>
```

### Dismissible Alert

```tsx
const [showAlert, setShowAlert] = useState(true);

{showAlert && (
  <Alert 
    variant="success"
    onDismiss={() => setShowAlert(false)}
  >
    <AlertTitle>Saved!</AlertTitle>
    <AlertDescription>Your profile has been updated.</AlertDescription>
  </Alert>
)}
```

### Alert in Forms

```tsx
<form onSubmit={handleSubmit}>
  {error && (
    <Alert variant="error" className="mb-4">
      <AlertTitle>Form Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )}
  
  {/* Form fields */}
  
  {success && (
    <Alert variant="success" className="mb-4">
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>Form submitted successfully.</AlertDescription>
    </Alert>
  )}
</form>
```

### Alert Stack

```tsx
<div className="space-y-2">
  <Alert variant="warning">
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>First alert</AlertDescription>
  </Alert>
  
  <Alert variant="error">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>Second alert</AlertDescription>
  </Alert>
  
  <Alert variant="success">
    <AlertTitle>Success</AlertTitle>
    <AlertDescription>Third alert</AlertDescription>
  </Alert>
</div>
```

---

## Common Patterns

### Form with Validation

```tsx
'use client';

import { useState } from 'react';
import { Button, Input, Alert, Card, CardContent } from '@/components/ui';

export function SignUpForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validate and submit
      const response = await fetch('/api/signup', { method: 'POST' });
      if (!response.ok) throw new Error('Signup failed');
      setSuccess(true);
    } catch (err) {
      setError('Unable to sign up. Please try again.');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4">
            Account created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" placeholder="your@email.com" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input type="password" placeholder="••••••••" required />
          </div>

          <Button fullWidth type="submit">
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Dashboard Card Grid

```tsx
export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* KPI Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">156</div>
          <p className="text-xs text-slate-600 mt-1">+12 this month</p>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex justify-between">
            <span>Active Classes</span>
            <Badge variant="active">4</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Class list */}
        </CardContent>
      </Card>

      {/* Action Card */}
      <Card variant="kid">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Latest Achievement</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="kidPrimary" fullWidth>
            View Trophy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Modal/Dialog Pattern

```tsx
export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">{message}</p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

### Status List

```tsx
export function StatusList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { name: 'Database', status: 'active' },
          { name: 'API Server', status: 'active' },
          { name: 'Email Service', status: 'pending' },
          { name: 'Cache', status: 'active' },
        ].map((item) => (
          <div key={item.name} className="flex justify-between items-center">
            <span>{item.name}</span>
            <Badge variant={item.status}>{item.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

---

## Accessibility

### Button Accessibility

```tsx
// ✅ Good - Text or aria-label
<Button size="icon" aria-label="Settings">
  <Settings />
</Button>

<Button>Save Changes</Button>

// ✅ Good - Semantic HTML
<button className={buttonVariants({ variant: 'default' })}>
  Click Me
</button>

// ❌ Bad - No label
<div onClick={handleClick}>
  <Icon />
</div>
```

### Form Accessibility

```tsx
// ✅ Good - Proper labels
<div>
  <label htmlFor="email" className="block text-sm font-medium">
    Email Address
  </label>
  <Input 
    id="email"
    type="email"
    aria-describedby="email-help"
    placeholder="your@email.com"
  />
  <p id="email-help" className="text-xs text-slate-500">
    We'll never share your email
  </p>
</div>

// ❌ Bad - Missing labels
<input type="email" placeholder="Email" />
```

### Alert Accessibility

```tsx
// ✅ Good - Role and proper structure
<Alert role="alert" variant="error">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Field is required</AlertDescription>
</Alert>

// ✅ Good - Live region
<div aria-live="polite" aria-atomic="true">
  <Alert variant="success">Saved!</Alert>
</div>
```

### Color Contrast

```tsx
// ✅ Good - High contrast
<p className="text-slate-900 bg-white">High contrast text</p>
<p className="text-white bg-indigo-600">High contrast text</p>

// ❌ Bad - Low contrast
<p className="text-slate-400 bg-slate-100">Low contrast text</p>
```

---

## Tips & Tricks

### Conditional Styling

```tsx
<Button 
  variant={isLoading ? 'ghost' : 'default'}
  disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

### Combining Classes

```tsx
import { cn } from '@/lib/utils';

<Button className={cn('custom-class', conditionalClass && 'extra-class')}>
  Smart Button
</Button>
```

### Re-usable Patterns

```tsx
export const StatusBadge = ({ status }: { status: 'active' | 'inactive' | 'pending' }) => (
  <Badge variant={status}>{status}</Badge>
);

// Usage
<StatusBadge status="active" />
```

---

For more information, see:
- **Full Guide:** DESIGN_SYSTEM.md
- **Quick Reference:** DESIGN_SYSTEM_QUICK_REFERENCE.md
- **Showcase:** http://localhost:3000/design-system
