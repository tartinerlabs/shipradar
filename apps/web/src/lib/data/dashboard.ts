import type { Release } from "@web/components/dashboard/release-card";

export interface DashboardStats {
  reposWatched: number;
  activeChannels: number;
  totalChannels: number;
}

// TODO: Restore API-backed dashboard stats once the API is healthy again.
export async function getDashboardStats(): Promise<DashboardStats> {
  return {
    reposWatched: 0,
    activeChannels: 0,
    totalChannels: 0,
  };
}

// TODO: Restore API-backed release data once the API is healthy again.
export async function getReleases(
  _limit = 5,
): Promise<{ releases: Release[] }> {
  return { releases: [] };
}
