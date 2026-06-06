import { Chip } from "@heroui/react";
import type { ReleaseCategory } from "@shipradar/types";

const categoryColor: Record<
  ReleaseCategory,
  "accent" | "success" | "default" | "warning" | "danger"
> = {
  major: "accent",
  minor: "success",
  patch: "default",
  security: "warning",
  breaking: "danger",
  unknown: "default",
};

interface CategoryBadgeProps {
  category: ReleaseCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Chip color={categoryColor[category]} variant="soft" size="sm">
      <Chip.Label>{category}</Chip.Label>
    </Chip>
  );
}
