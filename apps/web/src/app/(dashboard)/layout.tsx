import { Skeleton } from "@heroui/react";
import { DashboardLayoutContent } from "@web/components/dashboard-layout";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type ReactNode, Suspense } from "react";

function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-full">
      <div className="flex h-full w-64 flex-col gap-4 border-separator border-r p-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-separator border-b px-4">
          <Skeleton className="size-8" />
          <Skeleton className="h-9 w-80" />
          <Skeleton className="size-8" />
        </header>
        <main className="flex flex-1 flex-col gap-6 p-4 pt-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <NuqsAdapter>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </Suspense>
    </NuqsAdapter>
  );
}
