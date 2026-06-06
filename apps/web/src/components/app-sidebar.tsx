"use client";

import { Avatar, Typography } from "@heroui/react";
import { Sidebar } from "@heroui-pro/react";
import { UserMenu } from "@web/components/user-menu";
import { useSession } from "@web/lib/auth-client";
import {
  BadgeCheck,
  FolderGit2,
  LayoutDashboard,
  Plug,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Repositories",
    href: "/dashboard/repos",
    icon: FolderGit2,
  },
  {
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: Plug,
  },
];

const adminNavItem = {
  title: "Admin",
  href: "/dashboard/admin",
  icon: Shield,
};

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user;
  const isAdmin = user?.role === "admin";

  return (
    <Sidebar>
      <Sidebar.Header>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-2 py-1.5 no-underline"
        >
          <Avatar className="size-8 shrink-0 rounded-lg bg-accent text-accent-foreground">
            <Avatar.Fallback>
              <BadgeCheck className="size-4" />
            </Avatar.Fallback>
          </Avatar>
          <Typography className="flex flex-col leading-tight">
            <Typography type="body-sm" weight="semibold">
              ShipRadar
            </Typography>
            <Typography type="body-xs" color="muted">
              Dashboard
            </Typography>
          </Typography>
        </Link>
      </Sidebar.Header>

      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
          <Sidebar.Menu>
            {navItems.map((item) => (
              <Sidebar.MenuItem
                key={item.href}
                href={item.href}
                isCurrent={pathname === item.href}
                tooltip={item.title}
              >
                <Sidebar.MenuIcon>
                  <item.icon className="size-4" />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>{item.title}</Sidebar.MenuLabel>
              </Sidebar.MenuItem>
            ))}
            {isAdmin && (
              <Sidebar.MenuItem
                href={adminNavItem.href}
                isCurrent={
                  pathname === adminNavItem.href ||
                  pathname.startsWith(`${adminNavItem.href}/`)
                }
                tooltip={adminNavItem.title}
              >
                <Sidebar.MenuIcon>
                  <adminNavItem.icon className="size-4" />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>{adminNavItem.title}</Sidebar.MenuLabel>
              </Sidebar.MenuItem>
            )}
          </Sidebar.Menu>
        </Sidebar.Group>
      </Sidebar.Content>

      <Sidebar.Footer>
        <UserMenu />
      </Sidebar.Footer>
    </Sidebar>
  );
}
