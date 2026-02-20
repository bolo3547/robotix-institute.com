// Vitest setup file
// Add any global test setup here (e.g., mocking environment variables)

// Mock environment variables for tests
process.env.NEXTAUTH_SECRET = 'test-secret-for-vitest';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.ADMIN_SEED_KEY = 'test-seed-key';
