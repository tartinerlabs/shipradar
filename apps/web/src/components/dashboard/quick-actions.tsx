"use client";

import { Card, Typography } from "@heroui/react";
import { TelegramLinkDialog } from "@web/components/integrations/telegram-link-dialog";
import { AddRepoForm } from "@web/components/repos/add-repo-form";
import { api } from "@web/lib/api-client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { IntegrationToggle } from "./integration-toggle";

interface TelegramChannel {
  chatId: string;
  enabled: boolean;
}

interface TelegramStatusResponse {
  linked: boolean;
  channel?: TelegramChannel;
}

export function QuickActions() {
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [telegramChannel, setTelegramChannel] =
    useState<TelegramChannel | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [_isPending, startTransition] = useTransition();

  const fetchTelegramStatus = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await api.get<TelegramStatusResponse>(
          "/channels/telegram/status",
        );
        setTelegramLinked(data.linked);
        if (data.linked && data.channel) {
          setTelegramChannel({
            chatId: data.channel.chatId,
            enabled: data.channel.enabled,
          });
        }
      } catch {
        // Ignore errors
      }
    });
  }, []);

  useEffect(() => {
    fetchTelegramStatus();
  }, [fetchTelegramStatus]);

  return (
    <div className="flex flex-col gap-4">
      <Typography type="h6">Quick Actions</Typography>

      <div className="grid gap-4 md:grid-cols-2">
        <AddRepoForm />

        <Card>
          <Card.Header>
            <Card.Title>Integrations</Card.Title>
            <Card.Description>
              Manage your notification channels
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <IntegrationToggle
              type="telegram"
              linked={telegramLinked}
              enabled={telegramChannel?.enabled ?? false}
              chatId={telegramChannel?.chatId}
              onLink={() => setDialogOpen(true)}
              onToggle={(enabled) => {
                if (telegramChannel) {
                  setTelegramChannel({ ...telegramChannel, enabled });
                }
              }}
            />
          </Card.Content>
        </Card>
      </div>

      <TelegramLinkDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
