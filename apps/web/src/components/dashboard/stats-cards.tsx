"use client";

import { Avatar, Card, Skeleton, Typography } from "@heroui/react";
import { NumberValue } from "@heroui-pro/react";
import { api } from "@web/lib/api-client";
import { Bell, FolderGit2 } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

interface DashboardStats {
  reposWatched: number;
  activeChannels: number;
  totalChannels: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchStats = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await api.get<DashboardStats>("/dashboard/stats");
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
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatsCard
        icon={FolderGit2}
        label="Repos Watched"
        value={stats.reposWatched}
      />
      <StatsCard
        icon={Bell}
        label="Active Channels"
        value={stats.activeChannels}
        suffix={
          stats.totalChannels > 0 ? `/ ${stats.totalChannels}` : undefined
        }
      />
    </div>
  );
}

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
}

function StatsCard({ icon: Icon, label, value, suffix }: StatsCardProps) {
  return (
    <Card>
      <Card.Content>
        <Avatar>
          <Avatar.Fallback>
            <Icon className="size-5" />
          </Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <Typography type="body-sm" color="muted">
            {label}
          </Typography>
          <div className="flex items-baseline gap-1">
            <NumberValue value={value} />
            {suffix && (
              <Typography type="body-sm" color="muted">
                {suffix}
              </Typography>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

function StatsCardSkeleton() {
  return (
    <Card>
      <Card.Content>
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </Card.Content>
    </Card>
  );
}
