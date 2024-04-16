"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

import { api } from "~/trpc/react";

import { useOrigin } from "~/hooks/useOrigin";
import { useModal } from "~/hooks/useModalStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export const InviteModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const origin = useOrigin();

  const [copied, setCopied] = useState(false);

  const {
    mutate: generateNewInviteCode,
    data,
    isPending,
  } = api.server.newInviteCode.useMutation();

  const isModalOpen = isOpen && type === "invite";

  const inviteURL = `${origin}/invite/${data?.inviteCode ?? props.server?.inviteCode}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(inviteURL);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onGenerateNewInviteCode = () => {
    generateNewInviteCode({ id: props.server!.id });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-primary/70">
            Server Invite Link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-primary/80"
              value={inviteURL}
              disabled={isPending}
            />
            <Button
              size="icon"
              onClick={onCopy}
              disabled={isPending}
              variant="primary"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            variant="link"
            onClick={onGenerateNewInviteCode}
            className="mt-4 text-xs text-zinc-500 dark:text-primary/70"
            disabled={isPending}
          >
            Generate a new link
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
