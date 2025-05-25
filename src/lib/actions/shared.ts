"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// Helper function to get current user ID
export async function getCurrentUserId() {
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/login");
  }
  
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });
  
  if (!dbUser) {
    redirect("/login");
  }

  return dbUser.id;
}
