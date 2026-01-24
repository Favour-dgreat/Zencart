import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUserWithClerk() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  // 1️⃣ Try DB first (fast + safe)
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (existingUser) {
    return existingUser;
  }

  // 2️⃣ Only call Clerk if user not in DB
  let email = "unknown@email.com";

  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    email =
      clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)
        ?.emailAddress || email;
  } catch (err) {
    // ⚠️ DO NOT crash — Stripe redirects cause this
    console.warn("Clerk user fetch skipped:", err);
  }

  // 3️⃣ Upsert user safely
  return prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: {
      clerkId: userId,
      email,
    },
  });
}
