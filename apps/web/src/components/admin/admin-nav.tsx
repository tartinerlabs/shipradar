"use client";

import { buttonVariants } from "@heroui/react";
import { Activity, LayoutDashboard, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Users", href: "/dashboard/admin/users", icon: Users },
  { title: "Activity", href: "/dashboard/admin/activity", icon: Activity },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-lg bg-surface-secondary p-1">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href as Route}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              size: "sm",
            })}
          >
            <item.icon className="size-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
