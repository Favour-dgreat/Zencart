import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}
const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-12-15.clover",
});
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "PAID") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }

    const line_items = order.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
