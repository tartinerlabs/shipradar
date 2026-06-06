"use client";

import { Card, Skeleton, Typography } from "@heroui/react";
import { api } from "@web/lib/api-client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { type Release, ReleaseCard } from "./release-card";

interface ReleasesResponse {
  releases: Release[];
}

export function RecentReleases() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchReleases = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await api.get<ReleasesResponse>("/dashboard/releases");
        setReleases(data.releases || []);
      } catch {
        // Ignore errors
      }
    });
  }, []);

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  return (
    <div className="flex flex-col gap-4">
      <Typography type="h6">Recent Releases</Typography>

      {isPending && (
        <div className="flex flex-col gap-4">
          <ReleaseCardSkeleton />
          <ReleaseCardSkeleton />
          <ReleaseCardSkeleton />
        </div>
      )}

      {!isPending && releases.length === 0 && (
        <Card>
          <Card.Content>
            <Typography color="muted">No releases yet</Typography>
            <Typography type="body-sm" color="muted">
              Subscribe to repositories to see their latest releases here.
            </Typography>
          </Card.Content>
        </Card>
      )}

      {!isPending && releases.length > 0 && (
        <div className="flex flex-col gap-4">
          {releases.map((release) => (
            <ReleaseCard
              key={`${release.repoName}-${release.tagName}`}
              release={release}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReleaseCardSkeleton() {
  return (
    <Card>
      <Card.Header>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </Card.Header>
      <Card.Content>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
      </Card.Content>
    </Card>
  );
}
