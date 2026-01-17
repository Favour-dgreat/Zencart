// src/app/api/orders/route.ts - UPDATED
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
// import { GET } from "../products/route";

const prisma = new PrismaClient();

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthenticated. Please sign in." },
      { status: 401 }
    );
  }

  // Find user in database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }

  // Fetch orders for the user
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
     orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);

}

export async function POST(req: Request) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthenticated. Please sign in." },
        { status: 401 }
      );
    }

    // Find user in database (should exist via webhook)
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });


if (!user) {
  return NextResponse.json(
    {
      error: "User profile not ready yet",
      message: "Please wait a moment and try again.",
      retry: true,
    },
    { status: 409 }
  );
}

    // Process order...
   const { items } = await req.json();

// Fetch product prices
const products = await prisma.product.findMany({
  where: {
    id: { in: items.map((i: any) => i.productId || i.id) },
  },
});

// Calculate total
const total = items.reduce((sum: number, item: any) => {
  const product = products.find(
    (p) => p.id === (item.productId || item.id)
  );
  if (!product) return sum;
  return sum + product.price * (item.quantity || 1);
}, 0);

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: total,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || item.id,
            quantity: item.quantity || 1,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      userId: user.id,
      userEmail: user.email,
    });

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}