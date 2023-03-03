import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
prisma.profile.findMany({
  where:{

  }
})
export default prisma;
