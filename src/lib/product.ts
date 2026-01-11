import { PrismaClient } from "@prisma/client";


export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
