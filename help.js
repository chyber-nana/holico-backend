require('dotenv').config();
const prisma = require('./src/prisma/client');

async function main() {
  const targetName = '3C1';

  const result = await prisma.nominee.updateMany({
    where: {
      name: targetName,
    },
    data: {
      image: null, // ✅ correct field
    },
  });

  if (result.count > 0) {
    console.log(`Successfully removed image for nominee: ${targetName}`);
  } else {
    console.log(`No nominee found with the name: ${targetName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });