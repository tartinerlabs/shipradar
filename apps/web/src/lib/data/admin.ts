import {
  accounts,
  db,
  userChannels,
  userRepos,
  users,
} from "@shipradar/database";
import { redis } from "@shipradar/redis";
import { getSession } from "@web/lib/auth";
import { count, desc, eq, ilike, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";

export interface AdminStats {
  uniqueUsers: number;
  reposWatched: number;
  reposTracked: number;
  notificationsSent: number;
  releasesNotified: number;
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  repoCount: number;
}

export interface AdminUsersInput {
  search?: string;
  limit?: number;
  offset?: number;
  sortOrder?: "asc" | "desc";
}

export interface AdminUsersResult {
  users: AdminUserSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface AdminUserDetail {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: string | null;
    banned: boolean | null;
    banReason: string | null;
    banExpires: string | null;
    twoFactorEnabled: boolean | null;
    createdAt: string;
    updatedAt: string;
  };
  repos: {
    id: string;
    repoName: string;
    lastNotifiedTag: string | null;
    createdAt: string;
  }[];
  channels: {
    id: string;
    type: string;
    enabled: boolean;
    createdAt: string;
  }[];
  connectedAccounts: {
    id: string;
    providerId: string;
    createdAt: string;
  }[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
  impersonatedBy: string | null;
}

export interface AdminActivityResult {
  activity: ActivityLog[];
  limit: number;
  offset: number;
}

export async function requireAdmin() {
  const session = await getSession();

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  return session.user;
}

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin();
  return queryAdminStats();
}

async function queryAdminStats(): Promise<AdminStats> {
  "use cache: private";
  cacheTag("admin:stats");
  cacheLife("minutes");

  const [totalUsers, repos, notificationsSent, releasesNotified] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(users)
        .then((rows) => rows[0]?.count ?? 0),
      db.select({ repoName: userRepos.repoName }).from(userRepos),
      redis.get<number>("notifications:sent"),
      redis.get<number>("releases:notified"),
    ]);

  return {
    uniqueUsers: Number(totalUsers),
    reposWatched: new Set(repos.map((repo) => repo.repoName)).size,
    reposTracked: repos.length,
    notificationsSent: notificationsSent ?? 0,
    releasesNotified: releasesNotified ?? 0,
  };
}

export async function getAdminUsers(
  input: AdminUsersInput = {},
): Promise<AdminUsersResult> {
  await requireAdmin();
  return queryAdminUsers(normalizeAdminUsersInput(input));
}

async function queryAdminUsers(
  input: Required<AdminUsersInput>,
): Promise<AdminUsersResult> {
  "use cache: private";
  cacheTag("admin:users");
  cacheLife("minutes");

  const whereClause = input.search
    ? or(
        ilike(users.name, `%${input.search}%`),
        ilike(users.email, `%${input.search}%`),
      )
    : undefined;

  const [userList, total] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        banned: users.banned,
        banReason: users.banReason,
        banExpires: users.banExpires,
        createdAt: users.createdAt,
        repoCount: db.$count(userRepos, eq(userRepos.userId, users.id)),
      })
      .from(users)
      .where(whereClause)
      .orderBy(
        input.sortOrder === "asc" ? users.createdAt : desc(users.createdAt),
      )
      .limit(input.limit)
      .offset(input.offset),
    db
      .select({ count: count() })
      .from(users)
      .where(whereClause)
      .then((rows) => rows[0]?.count ?? 0),
  ]);

  return {
    users: userList.map((user) => ({
      ...user,
      banExpires: user.banExpires?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
    })),
    total: Number(total),
    limit: input.limit,
    offset: input.offset,
  };
}

export async function getAdminUser(
  id: string,
): Promise<AdminUserDetail | null> {
  await requireAdmin();
  return queryAdminUser(id);
}

async function queryAdminUser(id: string): Promise<AdminUserDetail | null> {
  "use cache: private";
  cacheTag("admin:users");
  cacheTag(`admin:user:${id}`);
  cacheLife("minutes");

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
      image: users.image,
      role: users.role,
      banned: users.banned,
      banReason: users.banReason,
      banExpires: users.banExpires,
      twoFactorEnabled: users.twoFactorEnabled,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user) return null;

  const [repos, channels, connectedAccounts] = await Promise.all([
    db
      .select({
        id: userRepos.id,
        repoName: userRepos.repoName,
        lastNotifiedTag: userRepos.lastNotifiedTag,
        createdAt: userRepos.createdAt,
      })
      .from(userRepos)
      .where(eq(userRepos.userId, id)),
    db
      .select({
        id: userChannels.id,
        type: userChannels.type,
        enabled: userChannels.enabled,
        createdAt: userChannels.createdAt,
      })
      .from(userChannels)
      .where(eq(userChannels.userId, id)),
    db
      .select({
        id: accounts.id,
        providerId: accounts.providerId,
        createdAt: accounts.createdAt,
      })
      .from(accounts)
      .where(eq(accounts.userId, id)),
  ]);

  return {
    user: {
      ...user,
      banExpires: user.banExpires?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    repos: repos.map((repo) => ({
      ...repo,
      createdAt: repo.createdAt.toISOString(),
    })),
    channels: channels.map((channel) => ({
      ...channel,
      createdAt: channel.createdAt.toISOString(),
    })),
    connectedAccounts: connectedAccounts.map((account) => ({
      ...account,
      createdAt: account.createdAt.toISOString(),
    })),
  };
}

export async function getAdminActivity(
  input: { limit?: number; offset?: number } = {},
): Promise<AdminActivityResult> {
  await requireAdmin();
  return queryAdminActivity({
    limit: normalizePositiveInt(input.limit, 20, 100),
    offset: normalizeNonNegativeInt(input.offset, 0),
  });
}

async function queryAdminActivity(input: {
  limit: number;
  offset: number;
}): Promise<AdminActivityResult> {
  "use cache: private";
  cacheTag("admin:activity");
  cacheLife("minutes");

  return { activity: [], limit: input.limit, offset: input.offset };
}

function normalizeAdminUsersInput(
  input: AdminUsersInput,
): Required<AdminUsersInput> {
  return {
    search: input.search?.trim() ?? "",
    limit: normalizePositiveInt(input.limit, 20, 100),
    offset: normalizeNonNegativeInt(input.offset, 0),
    sortOrder: input.sortOrder === "asc" ? "asc" : "desc",
  };
}

function normalizePositiveInt(
  value: number | undefined,
  fallback: number,
  max: number,
) {
  if (!Number.isInteger(value) || !value || value < 1) return fallback;
  return Math.min(value, max);
}

function normalizeNonNegativeInt(value: number | undefined, fallback: number) {
  if (!Number.isInteger(value) || value === undefined || value < 0) {
    return fallback;
  }
  return value;
}
