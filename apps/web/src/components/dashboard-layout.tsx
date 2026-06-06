"use client";

import { AppLayout, Navbar, Sidebar } from "@heroui-pro/react";
import { AppSidebar } from "@web/components/app-sidebar";
import { RepoSearch } from "@web/components/repos/repo-search";
import { ThemeToggle } from "@web/components/theme-toggle";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AppLayout
      navigate={(href) => router.push(href as Route)}
      sidebarCollapsible="icon"
      sidebar={<AppSidebar />}
      navbar={
        <Navbar maxWidth="full">
          <Navbar.Header>
            <AppLayout.MenuToggle />
            <Sidebar.Trigger />
            <Navbar.Spacer />
            <div className="hidden w-full max-w-sm md:block">
              <RepoSearch />
            </div>
            <Navbar.Spacer />
            <ThemeToggle />
          </Navbar.Header>
        </Navbar>
      }
    >
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
        {children}
      </div>
    </AppLayout>
  );
}
