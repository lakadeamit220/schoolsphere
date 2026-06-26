const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "lakadeamit220@gmail.com";

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin account already exists. Skipping seed.");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin", 10);

  await prisma.user.create({
    data: {
      name: "Amit Lakade",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin account created successfully!");
  console.log("Email: lakadeamit220@gmail.com");
  console.log("Password: admin");
  console.log("IMPORTANT: Change this password after first login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
