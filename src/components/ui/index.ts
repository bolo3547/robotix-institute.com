/**
 * UI Components Index
 * Central export for all design system components
 */

export { Button, buttonVariants } from './Button';
export type { ButtonProps } from './Button';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
} from './Card';
export type { CardProps } from './Card';

export { Badge, badgeVariants } from './Badge';
export type { BadgeProps } from './Badge';

export { Alert, AlertTitle, AlertDescription, alertVariants } from './Alert';
export type { AlertProps } from './Alert';

export { default as Input } from './Input';

// New components
export { Modal } from './Modal';
export { Dropdown } from './Dropdown';
export { Select } from './Select';
export type { SelectOption, SelectProps } from './Select';
export { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from './Table';
export { Tabs, TabList, TabTrigger, TabContent } from './Tabs';
export { Pagination } from './Pagination';
export { Avatar } from './Avatar';
export { Spinner } from './Spinner';
