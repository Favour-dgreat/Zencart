// src/lib/syncUser.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  // 1️⃣ Get Clerk auth
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  // 2️⃣ Fetch full Clerk user
  const clerkUser = await (await clerkClient()).users.getUser(userId);

  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

  if (!email) {
    throw new Error("User has no email address");
  }

  // 3️⃣ Upsert user in Prisma
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email,
    },
    create: {
      clerkId: userId,
      email,
    },
  });

  // 4️⃣ Return Prisma user
  return user;
}
