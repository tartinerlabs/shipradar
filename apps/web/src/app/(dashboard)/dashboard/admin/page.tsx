import { Avatar, Card, Typography } from "@heroui/react";
import { AdminNav } from "@web/components/admin/admin-nav";
import {
  AdminStatsCards,
  AdminStatsCardsSkeleton,
} from "@web/components/admin/admin-stats-cards";
import { Activity, ArrowRight, Shield, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Suspense } from "react";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar>
          <Avatar.Fallback>
            <Shield className="size-5" />
          </Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <Typography type="h1">Admin</Typography>
          <Typography color="muted">
            System overview and administration tools
          </Typography>
        </div>
      </div>

      {/* Navigation */}
      <AdminNav />

      {/* Stats */}
      <section className="flex flex-col gap-4">
        <Typography type="h6">System Metrics</Typography>
        <Suspense fallback={<AdminStatsCardsSkeleton />}>
          <AdminStatsCards />
        </Suspense>
      </section>

      {/* Quick Access */}
      <section className="flex flex-col gap-4">
        <Typography type="h6">Quick Access</Typography>
        <div className="grid gap-4 md:grid-cols-2">
          <QuickAccessCard
            title="User Management"
            description="View, search, and manage user accounts. Ban or unban users as needed."
            href="/dashboard/admin/users"
            icon={Users}
          />
          <QuickAccessCard
            title="Activity Logs"
            description="Monitor user sessions and login activity across the platform."
            href="/dashboard/admin/activity"
            icon={Activity}
          />
        </div>
      </section>
    </div>
  );
}

interface QuickAccessCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function QuickAccessCard({
  title,
  description,
  href,
  icon: Icon,
}: QuickAccessCardProps) {
  return (
    <Link href={href as Route}>
      <Card>
        <Card.Header>
          <Avatar>
            <Avatar.Fallback>
              <Icon className="size-5" />
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-1">
            <Card.Title>
              {title}
              <ArrowRight className="ml-2 inline size-4" />
            </Card.Title>
            <Card.Description>{description}</Card.Description>
          </div>
        </Card.Header>
      </Card>
    </Link>
  );
}
