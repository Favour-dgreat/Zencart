import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { auth } from "@clerk/nextjs/server";

interface OrderItem {
  productId: string;
  quantity: number;
}

interface OrderRequest {
  items: OrderItem[];
  total: number;
}

export const runtime = "nodejs"; // ✅ REQUIRED
export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { items, total } = (await req.json()) as OrderRequest;

  // find user
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      status: "PENDING",
      items: {
        create: items.map((item: OrderItem) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return NextResponse.json(order);
}
