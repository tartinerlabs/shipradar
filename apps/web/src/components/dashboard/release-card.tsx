import { Card, Typography } from "@heroui/react";
import type { AIAnalysisResult } from "@shipradar/types";
import { ExternalLink } from "lucide-react";
import { CategoryBadge } from "./category-badge";

export interface Release {
  repoName: string;
  tagName: string;
  releaseName: string | null;
  url: string;
  publishedAt: string | null;
  author: string | null;
  aiAnalysis: AIAnalysisResult | null;
}

interface ReleaseCardProps {
  release: Release;
}

export function ReleaseCard({ release }: ReleaseCardProps) {
  const timeAgo = release.publishedAt && formatTimeAgo(release.publishedAt);

  return (
    <Card>
      <Card.Header>
        <div className="flex flex-col gap-1">
          <a
            href={release.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 hover:underline"
          >
            <Typography type="body-sm" weight="medium">
              {release.repoName}
            </Typography>
            <ExternalLink className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
          <Typography.Code>{release.tagName}</Typography.Code>
        </div>
        {release.aiAnalysis && (
          <CategoryBadge category={release.aiAnalysis.category} />
        )}
      </Card.Header>
      <Card.Content>
        {release.aiAnalysis && (
          <>
            <Typography type="body-sm" color="muted">
              {release.aiAnalysis.summary}
            </Typography>
            {release.aiAnalysis.highlights.length > 0 && (
              <ul className="flex flex-col gap-1">
                {release.aiAnalysis.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight}>
                    <Typography type="body-sm" color="muted">
                      • {highlight}
                    </Typography>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {!release.aiAnalysis && (
          <Typography type="body-sm" color="muted">
            No AI analysis available
          </Typography>
        )}
        {(timeAgo || release.author) && (
          <Typography type="body-xs" color="muted">
            {timeAgo && <>Published {timeAgo}</>}
            {timeAgo && release.author && <> by </>}
            {release.author && (
              <Typography type="body-xs" weight="medium">
                {release.author}
              </Typography>
            )}
          </Typography>
        )}
      </Card.Content>
    </Card>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString();
}
