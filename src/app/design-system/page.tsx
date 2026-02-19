'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Alert, AlertTitle, AlertDescription } from '@/components/ui';
import { ChevronLeft, Bell, Trophy, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function DesignSystemPage() {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Design System</h1>
            <p className="text-slate-600">Complete component showcase for ROBOTIX</p>
          </div>
        </div>

        {/* Buttons Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Button variants for different user roles and contexts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Professional Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Professional Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Kid-Friendly Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Kid-Friendly Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="kidPrimary">Primary</Button>
                <Button variant="kidSecondary">Secondary</Button>
                <Button variant="kidGhost">Ghost</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* Loading State */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Loading State</h3>
              <Button loading>Processing...</Button>
            </div>

            {/* Full Width */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Full Width</h3>
              <Button fullWidth>Full Width Button</Button>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Icon Buttons</h3>
              <div className="flex gap-3">
                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button variant="kidPrimary" size="icon">
                  <Trophy className="w-5 h-5" />
                </Button>
                <Button size="lg">
                  <Trophy className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cards</CardTitle>
            <CardDescription>Card variants for different contexts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="text-lg">Default</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Standard card with light shadow</p>
                </CardContent>
              </Card>

              <Card variant="kid">
                <CardHeader>
                  <CardTitle className="text-lg">Kid-Friendly</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Playful card with blue border</p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Elevated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Strong shadow, no border</p>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardHeader>
                  <CardTitle className="text-lg">Outlined</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Border only, minimal shadow</p>
                </CardContent>
              </Card>

              <Card variant="surface">
                <CardHeader>
                  <CardTitle className="text-lg">Surface</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Light gray background</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status and role indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Status Badges */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Status Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="active">Active</Badge>
                <Badge variant="inactive">Inactive</Badge>
                <Badge variant="pending">Pending</Badge>
                <Badge variant="completed">Completed</Badge>
              </div>
            </div>

            {/* Role Badges */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Role Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="parent">Parent</Badge>
                <Badge variant="child">Child</Badge>
                <Badge variant="instructor">Instructor</Badge>
                <Badge variant="admin">Admin</Badge>
              </div>
            </div>

            {/* Level Badges */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Level Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="beginner">Beginner</Badge>
                <Badge variant="intermediate">Intermediate</Badge>
                <Badge variant="advanced">Advanced</Badge>
              </div>
            </div>

            {/* Semantic Badges */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Semantic Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>

            {/* Badge Sizes */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Sizes</h3>
              <div className="flex items-center gap-2">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>

            {/* Badge with Icon */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">With Icons</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
                  Completed
                </Badge>
                <Badge variant="warning" icon={<AlertTriangle className="w-3 h-3" />}>
                  Warning
                </Badge>
                <Badge variant="advanced" icon={<Trophy className="w-3 h-3" />}>
                  Advanced
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Alert variants for different message types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!dismissedAlerts.includes('success') && (
              <Alert
                variant="success"
                onDismiss={() => handleDismiss('success')}
              >
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your changes have been saved successfully.
                </AlertDescription>
              </Alert>
            )}

            {!dismissedAlerts.includes('warning') && (
              <Alert
                variant="warning"
                onDismiss={() => handleDismiss('warning')}
              >
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Please review your settings before proceeding.
                </AlertDescription>
              </Alert>
            )}

            {!dismissedAlerts.includes('error') && (
              <Alert
                variant="error"
                onDismiss={() => handleDismiss('error')}
              >
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  An error occurred. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {!dismissedAlerts.includes('info') && (
              <Alert
                variant="info"
                onDismiss={() => handleDismiss('info')}
              >
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  New features are available. Check them out!
                </AlertDescription>
              </Alert>
            )}

            {!dismissedAlerts.includes('playful') && (
              <Alert
                variant="playful"
                onDismiss={() => handleDismiss('playful')}
              >
                🎉 Great job! You've completed the mission!
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Colors Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Colors</CardTitle>
            <CardDescription>Kid-friendly and professional color palettes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Primary Colors */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Primary Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((level) => (
                  <div key={level}>
                    <div
                      className="h-20 rounded-lg mb-2"
                      style={{
                        backgroundColor: level === 50 ? '#E3F2FD' : 
                                         level === 100 ? '#BBDEFB' : 
                                         level === 200 ? '#90CAF9' : 
                                         level === 300 ? '#64B5F6' : 
                                         level === 400 ? '#42A5F5' : 
                                         level === 500 ? '#2196F3' : 
                                         level === 600 ? '#1E88E5' : 
                                         level === 700 ? '#1976D2' : 
                                         level === 800 ? '#1565C0' : '#0D47A1',
                      }}
                    />
                    <span className="text-xs text-slate-600">{level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Semantic Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="h-24 bg-green-500 rounded-lg mb-2" />
                  <span className="text-sm font-medium">Success</span>
                </div>
                <div>
                  <div className="h-24 bg-amber-500 rounded-lg mb-2" />
                  <span className="text-sm font-medium">Warning</span>
                </div>
                <div>
                  <div className="h-24 bg-red-500 rounded-lg mb-2" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <div>
                  <div className="h-24 bg-blue-500 rounded-lg mb-2" />
                  <span className="text-sm font-medium">Info</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Complete typography scale</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h6 className="text-3xl font-bold mb-2">Display Large (3.5rem)</h6>
              <p className="text-neutral-600">Bold, attention-grabbing headlines</p>
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-2">Heading 1 (2rem)</h1>
              <p className="text-neutral-600">Main page titles</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Heading 2 (1.5rem)</h2>
              <p className="text-neutral-600">Section headings</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Heading 3 (1.25rem)</h3>
              <p className="text-neutral-600">Subsection headings</p>
            </div>

            <div>
              <p className="text-base mb-2">Body Text (1rem) - Regular paragraph content looks like this with comfortable line height and spacing.</p>
              <p className="text-neutral-600">Default body text for reading</p>
            </div>

            <div>
              <p className="text-sm text-slate-600 mb-2">Small Text (0.875rem) - Used for secondary information</p>
              <p className="text-neutral-600">Secondary body text</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">Caption (0.75rem) - Used for metadata</p>
              <p className="text-neutral-600">Small UI text</p>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Note */}
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Accessibility Compliance</h3>
                <p className="text-blue-800 text-sm">
                  All components follow WCAG 2.1 AA standards with proper color contrast, semantic HTML, and keyboard navigation support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
