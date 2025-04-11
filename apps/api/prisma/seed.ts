import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  const t0 = performance.now();
  console.log("DB seed: Started...");

  await prisma.refreshToken.deleteMany();
  await prisma.account.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.provider.deleteMany();

  const provider = await prisma.provider.create({
    data: {
      name: "password",
      type: "PASSWORD",
    },
  });

  console.log(provider);

  const t1 = performance.now();
  console.log(`DB seed: Completed in ${t1 - t0} milliseconds`);
};

seed();
