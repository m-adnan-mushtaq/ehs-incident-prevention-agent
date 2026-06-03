import ControlledSelect from "@/components/form/ControlledSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import type { ISite } from "@/types/site";
import type { TChatMode } from "@/types/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CHAT_MODES, SITE_NONE_VALUE } from "../utils/chat.constants";
import { ChatModePickerCompact } from "./ChatModePickerCompact";

const schema = z.object({
  site_id: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  initialMode: TChatMode;
  sites: ISite[];
  loading?: boolean;
  onClose: () => void;
  onConfirm: (mode: TChatMode, siteId: string | null) => void;
};

export const NewChatDialog = ({
  open,
  initialMode,
  sites,
  loading,
  onClose,
  onConfirm,
}: Props) => {
  const [mode, setMode] = useState<TChatMode>(initialMode);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { site_id: SITE_NONE_VALUE },
  });

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New safety chat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-slate-700">Mode</p>
            <ChatModePickerCompact value={mode} onChange={setMode} />
          </div>
          <Form {...form}>
            <ControlledSelect
              control={form.control}
              name="site_id"
              label="Site (optional)"
              options={[
                { label: "No site selected", value: SITE_NONE_VALUE },
                ...sites.map((s) => ({ label: s.name, value: s.id })),
              ]}
            />
          </Form>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              const site = form.getValues("site_id");
              onConfirm(
                mode,
                site === SITE_NONE_VALUE ? null : site ?? null
              );
            }}
          >
            {CHAT_MODES.find((m) => m.value === mode)?.label ?? "Start chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
