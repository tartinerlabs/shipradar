"use client";

import {
  Avatar,
  Button,
  buttonVariants,
  Card,
  Chip,
  Link,
  ProgressBar,
  Typography,
} from "@heroui/react";
import { Crown, X } from "lucide-react";
import NextLink from "next/link";
import { useState } from "react";

interface UpgradePromptProps {
  current: number;
  limit: number;
  label: string;
  dismissible?: boolean;
}

export function UpgradePrompt({
  current,
  limit,
  label,
  dismissible = true,
}: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const percentage = Math.min((current / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= limit;

  if (!isNearLimit) return null;

  return (
    <Card>
      <Card.Header>
        <Avatar>
          <Avatar.Fallback>
            <Crown className="size-5" />
          </Avatar.Fallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Typography type="body-sm" weight="medium">
              {isAtLimit
                ? `${label} limit reached`
                : `Approaching ${label} limit`}
            </Typography>
            <Chip
              color={isAtLimit ? "danger" : "default"}
              variant="soft"
              size="sm"
            >
              <Chip.Label>
                {current}/{limit}
              </Chip.Label>
            </Chip>
          </div>
          <Typography type="body-sm" color="muted">
            {isAtLimit
              ? `You've reached your ${label} limit. Upgrade to Pro for unlimited access.`
              : `You're using ${current} of ${limit} ${label}. Upgrade to Pro for unlimited access.`}
          </Typography>
        </div>
        {dismissible && (
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            aria-label="Dismiss"
            onPress={() => setDismissed(true)}
          >
            <X className="size-4" />
          </Button>
        )}
      </Card.Header>
      <Card.Content>
        <ProgressBar value={percentage} />
      </Card.Content>
      <Card.Footer>
        <NextLink href="/pricing" className={buttonVariants({ size: "sm" })}>
          Upgrade to Pro
        </NextLink>
        <Link
          href="/api/auth/checkout/pro-monthly"
          className={buttonVariants({ size: "sm", variant: "ghost" })}
        >
          $3/mo →
        </Link>
      </Card.Footer>
    </Card>
  );
}
