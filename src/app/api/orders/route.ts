import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUserWithClerk } from "@/lib/syncUserWithClerk";

export const runtime = "nodejs";

/* =======================
   GET — fetch user orders
======================= */
export async function GET() {
  try {
    const user = await syncUserWithClerk();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET /orders error:", error);
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch orders" },
      { status: 401 }
    );
  }
}

/* =======================
   POST — create order
======================= */
export async function POST(req: Request) {
  try {
    const user = await syncUserWithClerk();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    // Fetch products
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

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: total,
        status: "PENDING",
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
    });
  } catch (error: any) {
    console.error("POST /orders error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
