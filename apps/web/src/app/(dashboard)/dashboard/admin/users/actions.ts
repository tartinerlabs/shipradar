"use server";

import { db, users } from "@shipradar/database";
import { requireAdmin } from "@web/lib/data/admin";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";

export interface BanUserInput {
  banReason?: string;
  banExpiresIn?: number;
}

export async function banUser(userId: string, input: BanUserInput = {}) {
  const adminUser = await requireAdmin();

  if (userId === adminUser.id) {
    throw new Error("Cannot ban yourself");
  }

  const [targetUser] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) {
    throw new Error("User not found");
  }

  if (targetUser.role === "admin") {
    throw new Error("Cannot ban admin users");
  }

  await db
    .update(users)
    .set({
      banned: true,
      banReason: input.banReason || null,
      banExpires: input.banExpiresIn
        ? new Date(Date.now() + input.banExpiresIn * 1000)
        : null,
    })
    .where(eq(users.id, userId));

  updateAdminUserTags(userId);
}

export async function unbanUser(userId: string) {
  await requireAdmin();

  await db
    .update(users)
    .set({
      banned: false,
      banReason: null,
      banExpires: null,
    })
    .where(eq(users.id, userId));

  updateAdminUserTags(userId);
}

function updateAdminUserTags(userId: string) {
  updateTag("admin:users");
  updateTag("admin:stats");
  updateTag(`admin:user:${userId}`);
}
