import { Chip, Tooltip, Typography } from "@heroui/react";
import { Crown, Lock } from "lucide-react";
import NextLink from "next/link";

interface ProBadgeProps {
  showLock?: boolean;
  size?: "sm" | "default";
}

export function ProBadge({ showLock = true, size = "default" }: ProBadgeProps) {
  const isSmall = size === "sm";
  const iconSize = isSmall ? "size-3" : "size-4";
  const chipSize = isSmall ? "sm" : "md";

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <NextLink href="/pricing">
          <Chip color="warning" variant="soft" size={chipSize}>
            {showLock && <Lock className={iconSize} />}
            {!showLock && <Crown className={iconSize} />}
            <Chip.Label>Pro</Chip.Label>
          </Chip>
        </NextLink>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Arrow />
        <Typography type="body-sm">
          This feature requires a Pro subscription
        </Typography>
      </Tooltip.Content>
    </Tooltip>
  );
}

interface ProFeatureProps {
  children: React.ReactNode;
  isPro: boolean;
  label?: string;
}

export function ProFeature({ children, isPro, label }: ProFeatureProps) {
  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center gap-2">
      {label && (
        <Typography type="body-sm" color="muted">
          {label}
        </Typography>
      )}
      <ProBadge size="sm" />
    </div>
  );
}
