"use client";

import { Typography } from "@heroui/react";
import { Sheet } from "@heroui-pro/react";
import { type ReactElement, useState } from "react";
import { PricingCards } from "./pricing-cards";

interface PricingDialogProps {
  children: ReactElement<{ onPress?: () => void }>;
}

export function PricingDialog({ children }: PricingDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet isOpen={open} onOpenChange={setOpen} placement="right">
      <Sheet.Trigger>{children}</Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Heading>Choose your plan</Sheet.Heading>
          <Typography type="body-sm" color="muted">
            Start free and upgrade when you need more.
          </Typography>
        </Sheet.Header>
        <Sheet.Body>
          <PricingCards compact onCheckout={() => setOpen(false)} />
        </Sheet.Body>
      </Sheet.Content>
    </Sheet>
  );
}
