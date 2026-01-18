// src/app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Get the webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    console.error("❌ CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get the headers from the request
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers");
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log("Webhook verified successfully");
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  // Get the event type
  const eventType = evt.type;
  console.log(`📬 Webhook received: ${eventType}`);

  // Handle different event types
  try {
    switch (eventType) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;
        
      case "user.updated":
        await handleUserUpdated(evt.data);
        break;
        
      case "user.deleted":
        await handleUserDeleted(evt.data);
        break;
        
      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook", details: error.message },
      { status: 500 }
    );
  }
}

// ========== EVENT HANDLERS ==========

async function handleUserCreated(userData: any) {
  console.log("👤 Handling user.created event");
  
  const { id, email_addresses, first_name, last_name } = userData;
  
  // Get primary email
  const primaryEmail = email_addresses.find(
    (email: any) => email.id === userData.primary_email_address_id
  );
  
  const email = primaryEmail?.email_address || email_addresses[0]?.email_address || "";
  
  if (!email) {
    console.warn("⚠️ No email found for user:", id);
    return;
  }

  try {
    // Check if user already exists (idempotency)
    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email,
      },
      create: {
        clerkId: id,
        email,
      },
    });

    console.log(`✅ User created in database: ${id}`);
  } catch (error: any) {
    console.error(`❌ Failed to create user ${id}:`, error.message);
  }
}

async function handleUserUpdated(userData: any) {
  console.log("🔄 Handling user.updated event");
  
  const { id, email_addresses } = userData;
  
  // Get primary email
  const primaryEmail = email_addresses.find(
    (email: any) => email.id === userData.primary_email_address_id
  );
  
  const email = primaryEmail?.email_address || email_addresses[0]?.email_address || "";

  try {
    // Update user in database
    const updatedUser = await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email: email,
        // Update any other fields
      },
      create: {
        clerkId: id,
        email: email,
        // This shouldn't happen often, but handles case where webhook missed creation
      },
    });

    console.log(`✅ User updated in database: ${updatedUser.id}`);
    
  } catch (error: any) {
    console.error(`❌ Failed to update user ${id}:`, error.message);
  }
}

async function handleUserDeleted(userData: any) {
  console.log("🗑️ Handling user.deleted event");
  
  const { id } = userData;

  try {
    // Delete user from database
    await prisma.user.delete({
      where: { clerkId: id },
    });

    console.log(`✅ User deleted from database: ${id}`);
    
  } catch (error: any) {
    // User might not exist in database, that's okay
    if (error.code === "P2025") {
      console.log(`ℹ️ User ${id} not found in database, nothing to delete`);
    } else {
      console.error(`❌ Failed to delete user ${id}:`, error.message);
    }
  }
}
