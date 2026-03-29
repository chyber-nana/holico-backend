require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    name: 'FACE OF HOLICO',
    slug: 'face-of-holico',
    description: 'Award for the face of Holico',
  },
  {
    name: 'BEST CLUB',
    slug: 'best-club',
    description: 'Award for the best club',
  },
  {
    name: 'BEST CLASS',
    slug: 'best-class',
    description: 'Award for the best class',
  },
  {
    name: 'BEST HOUSE',
    slug: 'best-house',
    description: 'Award for the best house',
  },
  {
    name: 'BEST DANCER',
    slug: 'best-dancer',
    description: 'Award for the best dancer',
  },
  {
    name: 'FATTEST PURSE',
    slug: 'fattest-purse',
    description: 'Award for the fattest purse',
  },
  {
    name: 'MOST FASHIONABLE',
    slug: 'most-fashionable',
    description: 'Award for the most fashionable',
  },
  {
    name: 'MOST PHOTOGENIC',
    slug: 'most-photogenic',
    description: 'Award for the most photogenic',
  },
];

async function main() {
  console.log('Clearing database...');

  // 🔥 Clear existing data (important order because of relations)
  await prisma.vote.deleteMany();
  await prisma.nominee.deleteMany();
  await prisma.category.deleteMany();

  console.log('Seeding categories...');

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log('✅ Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });