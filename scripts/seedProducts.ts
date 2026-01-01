import "dotenv/config";
import axios from "axios";
import { prisma } from "../lib/prisma";

type CategoryKey = 'MEN' | 'WOMEN' | 'ACCESSORIES' | 'FOOTWEAR' | 'GLASSES' | 'GADGETS';

function mapCategory(category: string): CategoryKey {
  switch (category.toLowerCase()) {
    case "men's clothing":
      return "MEN";
    case "women's clothing":
      return "WOMEN";
    case "jewelery":
      return "ACCESSORIES";
    case "electronics":
      return "GADGETS";
    default:
      return "ACCESSORIES";
  }
}

async function seedProducts() {
  const { data } = await axios.get('https://fakestoreapi.com/products');

  for (const p of data) {
    await prisma.product.upsert({
      where: { id: String(p.id) },
      update: {
        title: p.title,
        price: p.price,
        image: p.image,
        description: p.description,
        category: mapCategory(p.category),
      },
      create: {
        id: String(p.id),
        title: p.title,
        price: p.price,
        image: p.image,
        description: p.description,
        category: mapCategory(p.category),
      },
    });
  }

  console.log("Products seeded successfully!");
}

seedProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
