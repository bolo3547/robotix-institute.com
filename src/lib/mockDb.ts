// Shared mock user database (in-memory)
// In production, replace with a real database (Prisma + PostgreSQL, etc.)

const HASH = '$2a$10$K9z6OM2eNUd6Fp0.eJ80quPGGxfgFwqG1inMCexb1Clnu05t7j8Oi'; // password123

export const mockUsers: Record<string, any> = {
  'parent@robotix.com': {
    id: 'parent-1',
    email: 'parent@robotix.com',
    name: 'John Parent',
    role: 'parent',
    password: HASH,
    phone: '+260977123456',
    children: ['child-1'],
  },
  'child@robotix.com': {
    id: 'child-1',
    email: 'child@robotix.com',
    name: 'Emma Student',
    role: 'student',
    password: HASH,
    dateOfBirth: new Date('2015-05-15'),
    parentId: 'parent-1',
  },
  'instructor@robotix.com': {
    id: 'instructor-1',
    email: 'instructor@robotix.com',
    name: 'Alice Instructor',
    role: 'instructor',
    password: HASH,
    bio: 'Passionate robotics educator with 5+ years experience',
  },
  'admin@robotix.com': {
    id: 'admin-1',
    email: 'admin@robotix.com',
    name: 'Admin User',
    role: 'admin',
    password: HASH,
  },
};

export function addUser(user: any) {
  mockUsers[user.email] = user;
}
