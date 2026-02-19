// Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-gallery.ts
// Or: pnpm exec ts-node scripts/seed-gallery.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add your downloaded photos here
// Place photos in public/images/gallery/ folder
const photos = [
  {
    title: 'Robotics Workshop Session',
    description: 'Students building robots during our weekend workshop at BongoHive',
    url: '/images/gallery/workshop-1.jpg',
    category: 'robotics',
  },
  {
    title: 'Coding Class in Action',
    description: 'Young coders learning Python programming',
    url: '/images/gallery/coding-1.jpg',
    category: 'students',
  },
  {
    title: 'Robot Competition',
    description: 'Our students competing in the annual robotics competition',
    url: '/images/gallery/competition-1.jpg',
    category: 'events',
  },
  {
    title: 'Student Projects Showcase',
    description: 'Amazing projects built by our students',
    url: '/images/gallery/projects-1.jpg',
    category: 'projects',
  },
  {
    title: 'Team Building Activities',
    description: 'Collaborative learning and team activities',
    url: '/images/gallery/team-1.jpg',
    category: 'general',
  },
  // Add more photos here...
  // Example:
  // {
  //   title: 'Photo Title',
  //   description: 'Photo description',
  //   url: '/images/gallery/filename.jpg', // Path in public folder
  //   category: 'robotics', // Options: general, robotics, events, students, projects
  // },
];

async function main() {
  console.log('🖼️  Seeding gallery photos...');
  
  for (const photo of photos) {
    const created = await prisma.photo.create({
      data: {
        title: photo.title,
        description: photo.description,
        url: photo.url,
        category: photo.category,
        published: true,
      },
    });
    console.log(`  ✅ Added: ${created.title}`);
  }
  
  console.log(`\n🎉 Successfully added ${photos.length} photos to the gallery!`);
}

main()
  .catch((e) => {
    console.error('Error seeding photos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
