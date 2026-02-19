const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@robotix.com' },
    update: {},
    create: {
      email: 'admin@robotix.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Create demo parent
  const parentPassword = await hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'parent@robotix.com' },
    update: {},
    create: {
      email: 'parent@robotix.com',
      name: 'John Parent',
      password: parentPassword,
      role: 'parent',
    },
  });

  // Create demo instructor
  await prisma.user.upsert({
    where: { email: 'instructor@robotix.com' },
    update: {},
    create: {
      email: 'instructor@robotix.com',
      name: 'Alice Instructor',
      password: parentPassword,
      role: 'instructor',
    },
  });

  // Create demo student
  await prisma.user.upsert({
    where: { email: 'student@robotix.com' },
    update: {},
    create: {
      email: 'student@robotix.com',
      name: 'Emma Student',
      password: parentPassword,
      role: 'student',
    },
  });

  // Seed gallery photos
  const photos = [
    { title: 'Line-Following Robot', description: 'An autonomous line-following robot built with Arduino and IR sensors.', url: '/robotix1.jpg', category: 'robotics' },
    { title: 'Weather Dashboard App', description: 'A real-time weather dashboard using Python and OpenWeatherMap API.', url: '/ai-learning.jpg', category: 'projects' },
    { title: 'School Management Portal', description: 'A full-stack school management web app.', url: '/students2.jpg', category: 'projects' },
    { title: 'Obstacle Avoidance Drone', description: 'A drone programmed to navigate obstacle courses autonomously.', url: '/robotix3.jpg', category: 'robotics' },
    { title: 'Crop Disease Detector', description: 'An ML model that identifies crop diseases from plant leaf images.', url: '/digital-divide.jpg', category: 'projects' },
    { title: 'Smart Irrigation System', description: 'An Arduino-based system that monitors soil moisture.', url: '/robotix1.jpg', category: 'robotics' },
  ];

  for (const photo of photos) {
    await prisma.photo.create({ data: photo });
  }

  // Seed events
  const events = [
    {
      title: 'Open Day: Experience Robotix',
      description: 'Visit our facility, meet instructors, and let your child try a free mini-workshop. Refreshments provided.',
      date: new Date('2026-02-22'),
      time: '9:00 AM - 1:00 PM',
      location: 'Robotix Institute, Great East Road',
      category: 'openday',
      featured: true,
    },
    {
      title: 'Build Your First Robot Workshop',
      description: 'A hands-on 4-hour workshop where kids ages 6-12 build and program their first robot to take home.',
      date: new Date('2026-03-01'),
      time: '10:00 AM - 2:00 PM',
      location: 'Robotix Institute, Great East Road',
      category: 'workshop',
      featured: false,
    },
    {
      title: 'Easter Holiday Coding Camp',
      description: 'A week-long intensive coding camp during Easter break. Learn Python, build games, and make new friends!',
      date: new Date('2026-03-30'),
      time: '8:30 AM - 4:00 PM (5 days)',
      location: 'Robotix Institute, Great East Road',
      category: 'camp',
      featured: true,
    },
    {
      title: 'Zambia Junior Robotics Challenge 2026',
      description: 'Annual robotics competition for schools and coding clubs. Teams of 2-4 students compete in challenges.',
      date: new Date('2026-04-19'),
      time: '8:00 AM - 5:00 PM',
      location: 'Mulungushi Conference Centre, Lusaka',
      category: 'competition',
      featured: true,
    },
    {
      title: 'Parent Webinar: STEM Careers for Your Child',
      description: 'Learn about career paths in STEM, how to support your child\'s tech journey, and Q&A with industry professionals.',
      date: new Date('2026-03-15'),
      time: '7:00 PM - 8:30 PM',
      location: 'Online (Zoom)',
      category: 'webinar',
      featured: false,
    },
    {
      title: 'Drone Flying & Programming Workshop',
      description: 'Learn to fly and program drones! Ages 10+. Includes outdoor flying practice and autonomous flight programming.',
      date: new Date('2026-04-05'),
      time: '9:00 AM - 1:00 PM',
      location: 'Robotix Institute, Great East Road',
      category: 'workshop',
      featured: false,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log('✅ Database seeded successfully!');
  console.log('   Admin login: admin@robotix.com / admin123');
  console.log('   Parent login: parent@robotix.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
