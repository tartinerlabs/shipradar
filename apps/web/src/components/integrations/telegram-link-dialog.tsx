"use client";

import { Button, buttonVariants, Link, Modal, Typography } from "@heroui/react";
import { generateTelegramCode } from "@web/app/(dashboard)/dashboard/integrations/actions";
import { Check, Copy } from "lucide-react";
import { useState, useTransition } from "react";

interface TelegramLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TelegramLinkDialog({
  open,
  onOpenChange,
}: TelegramLinkDialogProps) {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGenerateCode = () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await generateTelegramCode();
        setCode(data.code);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate code",
        );
      }
    });
  };

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(`/link ${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setCode(null);
      setError(null);
      setCopied(false);
    }
  };

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={handleOpenChange}>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Link Telegram Account</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            {!code && (
              <>
                <Typography type="body-sm" color="muted">
                  Generate a one-time code and send it to our Telegram bot to
                  link your account.
                </Typography>
                {error && (
                  <Typography type="body-sm" className="text-danger">
                    {error}
                  </Typography>
                )}
                <Button
                  onPress={handleGenerateCode}
                  isDisabled={isPending}
                  isPending={isPending}
                >
                  Generate Link Code
                </Button>
              </>
            )}
            {code && (
              <>
                <div className="flex flex-col gap-2">
                  <Typography type="body-sm" color="muted">
                    Send this command to{" "}
                    <Link
                      href="https://t.me/ShipRadar_Bot"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @ShipRadar_Bot
                    </Link>
                    :
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Typography.Code>/link {code}</Typography.Code>
                    <Button
                      isIconOnly
                      variant="outline"
                      aria-label="Copy code"
                      onPress={copyCode}
                    >
                      {copied && <Check className="size-4" />}
                      {!copied && <Copy className="size-4" />}
                    </Button>
                  </div>
                  <Typography type="body-xs" color="muted">
                    This code expires in 10 minutes.
                  </Typography>
                </div>
                <Link
                  href="https://t.me/ShipRadar_Bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Open Telegram Bot
                  <Link.Icon />
                </Link>
              </>
            )}
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
