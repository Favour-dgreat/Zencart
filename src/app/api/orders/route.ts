import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items, total } = await req.json();

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
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  });

  return NextResponse.json(order);
}
