"use client";

import { Avatar, Card, Skeleton, Typography } from "@heroui/react";
import { NumberValue } from "@heroui-pro/react";
import { api } from "@web/lib/api-client";
import { Bell, FolderGit2, Send, Tag, Users } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

interface AdminStats {
  uniqueUsers: number;
  reposWatched: number;
  reposTracked: number;
  notificationsSent: number;
  releasesNotified: number;
}

export function AdminStatsCards() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchStats = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await api.get<AdminStats>("/admin/stats");
        setStats(data);
      } catch {
        // Ignore errors
      }
    });
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isPending || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {["s0", "s1", "s2", "s3", "s4"].map((id) => (
          <AdminStatsCardSkeleton key={id} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <AdminStatsCard
        icon={Users}
        label="Total Users"
        value={stats.uniqueUsers}
      />
      <AdminStatsCard
        icon={FolderGit2}
        label="Unique Repos"
        value={stats.reposWatched}
      />
      <AdminStatsCard
        icon={Bell}
        label="Repos Tracked"
        value={stats.reposTracked}
      />
      <AdminStatsCard
        icon={Send}
        label="Notifications"
        value={stats.notificationsSent}
      />
      <AdminStatsCard
        icon={Tag}
        label="Releases"
        value={stats.releasesNotified}
      />
    </div>
  );
}

interface AdminStatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}

function AdminStatsCard({ icon: Icon, label, value }: AdminStatsCardProps) {
  return (
    <Card>
      <Card.Content>
        <Avatar>
          <Avatar.Fallback>
            <Icon className="size-5" />
          </Avatar.Fallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          <Typography type="body-xs" color="muted" truncate>
            {label}
          </Typography>
          <NumberValue value={value} notation="compact" />
        </div>
      </Card.Content>
    </Card>
  );
}

function AdminStatsCardSkeleton() {
  return (
    <Card>
      <Card.Content>
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-12" />
        </div>
      </Card.Content>
    </Card>
  );
}
