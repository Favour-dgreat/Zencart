import "dotenv/config";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function mapCategory(category) {
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
  const { data } = await axios.get("https://fakestoreapi.com/products");

  for (const p of data) {
    await prisma.product.create({
      data: {
        title: p.title,
        price: p.price,
        image: p.image,
        description: p.description,
        category: mapCategory(p.category),
      },
    });
  }

  console.log("✅ Products seeded successfully!");
}

seedProducts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
