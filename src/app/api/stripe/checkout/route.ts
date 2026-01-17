import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Stripe } from "@/libs/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json();

  // Get user
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get products
  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map((i: any) => i.productId) },
    },
  });

  const line_items = items.map((item: any) => {
    const product = products.find(p => p.id === item.productId);

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product?.title || "Product",
        },
        unit_amount: Math.round((product?.price || 0) * 100),
      },
      quantity: item.quantity,
    };
  });

  const total = line_items.reduce(
    (sum, li) => sum + li.price_data.unit_amount * li.quantity,
    0
  ) / 100;

  // Create order (PENDING)
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  });

  // Create Stripe session
  const session = await Stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
