import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
