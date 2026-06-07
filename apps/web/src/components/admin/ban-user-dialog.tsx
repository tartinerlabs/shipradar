"use client";

import {
  Button,
  Label,
  ListBox,
  Modal,
  Select,
  TextArea,
  TextField,
  Typography,
} from "@heroui/react";
import { banUser } from "@web/app/(dashboard)/dashboard/admin/users/actions";
import { AlertTriangle, Ban } from "lucide-react";
import { type Key, useState, useTransition } from "react";

interface BanUserDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBanned: () => void;
}

const DURATION_OPTIONS = [
  { value: "86400", label: "1 day" },
  { value: "604800", label: "7 days" },
  { value: "2592000", label: "30 days" },
  { value: "permanent", label: "Permanent" },
];

export function BanUserDialog({
  user,
  open,
  onOpenChange,
  onBanned,
}: BanUserDialogProps) {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState<string>("604800");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleBan = () => {
    startTransition(async () => {
      try {
        setError(null);
        await banUser(user.id, {
          banReason: reason || undefined,
          banExpiresIn: duration === "permanent" ? undefined : Number(duration),
        });
        onBanned();
        onOpenChange(false);
        setReason("");
        setDuration("604800");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to ban user");
      }
    });
  };

  const handleDurationChange = (key: Key | null) => {
    if (key !== null) setDuration(String(key));
  };

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon>
              <Ban className="size-5 text-danger" />
            </Modal.Icon>
            <Modal.Heading>Ban User</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <Typography color="muted">
              Ban <Typography weight="medium">{user.name}</Typography> (
              {user.email}) from accessing the platform.
            </Typography>

            <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <Typography type="body-sm" color="muted">
                This action will immediately revoke the user&apos;s access. They
                will not be able to log in until unbanned.
              </Typography>
            </div>

            {error && (
              <Typography type="body-sm" className="text-danger">
                {error}
              </Typography>
            )}

            <Select
              selectedKey={duration}
              onSelectionChange={handleDurationChange}
              placeholder="Select duration"
            >
              <Label>Duration</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {DURATION_OPTIONS.map((option) => (
                    <ListBox.Item
                      key={option.value}
                      id={option.value}
                      textValue={option.label}
                    >
                      <Label>{option.label}</Label>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <TextField value={reason} onChange={setReason}>
              <Label>Reason (optional)</Label>
              <TextArea
                placeholder="Enter the reason for banning this user..."
                rows={3}
              />
            </TextField>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="secondary" isDisabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onPress={handleBan}
              isDisabled={isPending}
              isPending={isPending}
            >
              <Ban className="size-4" />
              Ban User
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
