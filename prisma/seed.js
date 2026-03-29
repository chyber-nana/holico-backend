require('dotenv').config();
const bcrypt = require('bcrypt');
const prisma = require('../src/prisma/client');

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const username = process.env.ADMIN_NAME;
  const password = process.env.ADMIN_PASSWORD;

  const existing = await prisma.admin.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  console.log('Admin seeded successfully');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });