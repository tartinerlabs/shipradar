import { Avatar, buttonVariants, Typography } from "@heroui/react";
import {
  UserDetailCard,
  UserDetailCardSkeleton,
} from "@web/components/admin/user-detail-card";
import { getAdminUser } from "@web/lib/data/admin";
import { ArrowLeft, Shield } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href={"/dashboard/admin/users" as Route}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="size-4" />
          Back to Users
        </Link>
        <div className="flex items-center gap-3">
          <Avatar>
            <Avatar.Fallback>
              <Shield className="size-5" />
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <Typography type="h1">User Details</Typography>
            <Typography color="muted">View and manage user account</Typography>
          </div>
        </div>
      </div>

      {/* User Detail */}
      <Suspense fallback={<UserDetailCardSkeleton />}>
        <AdminUserDetail userId={id} />
      </Suspense>
    </div>
  );
}

async function AdminUserDetail({ userId }: { userId: string }) {
  const data = await getAdminUser(userId);

  if (!data) {
    notFound();
  }

  return <UserDetailCard data={data} />;
}
