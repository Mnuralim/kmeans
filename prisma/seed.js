const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  console.log("Seeding admin...");

  const defaultAdmin = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  };

  const existingAdmin = await prisma.user.findFirst({
    where: { username: defaultAdmin.username },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash(defaultAdmin.password, 10);

    await prisma.user.create({
      data: {
        username: defaultAdmin.username,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin seeded successfully!");
  } else {
    console.log("Admin already exists. Skipping seeding.");
  }
}

async function createHeadMaster() {
  console.log("Seeding headmaster...");

  const defaultHeadMaster = {
    username: process.env.HEADMASTER_USERNAME,
    password: process.env.HEADMASTER_PASSWORD,
  };

  const existingAdmin = await prisma.user.findFirst({
    where: { username: defaultHeadMaster.username },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash(defaultHeadMaster.password, 10);

    await prisma.user.create({
      data: {
        username: defaultHeadMaster.username,
        password: hashedPassword,
        role: "HEAD_MASTER",
      },
    });

    console.log("Headmaster seeded successfully!");
  } else {
    console.log("Headmaster already exists. Skipping seeding.");
  }
}

async function main() {
  await createAdmin();
  await createHeadMaster();
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
