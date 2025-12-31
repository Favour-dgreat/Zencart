import "dotenv/config";

import axios from "axios";
import { prisma } from "../lib/prisma";

async function seedProduct() {
  const res = await axios.get("https://fakestoreapi.com/products");
  const products: any[] = res.data;

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: String(p.id) },
      update: {
        title: p.title,
        price: p.price,
        image: p.image,
        description: p.description,
        category: p.category,
      },
      create: {
        id: String(p.id),
        title: p.title,
        price: p.price,
        image: p.image,
        description: p.description,
        category: p.category,
      },
    });
  }

  console.log("Products Seeded Successfully");
}

seedProduct()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
