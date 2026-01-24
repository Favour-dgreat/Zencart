import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Optional, keeps Node API runtime

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  if(!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    console.error("⚠️  Webhook signature verification failed.");
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if(!orderId) {
      return NextResponse.json({ error: "Missing orderId in metadata" }, { status: 400 });
    }

 await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
      },
    });
    console.log(`✅  Order ${orderId} marked as PAID.`);
  }

  return NextResponse.json({ received: true });
}
