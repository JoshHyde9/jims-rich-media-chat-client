"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

import { useModal } from "~/hooks/useModalStore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteChannel";

  const { mutate: deleteChannel, isPending } = api.channel.delete.useMutation({
    onSuccess: async (updatedServer) => {
      onClose();

      if (updatedServer) {
        router.refresh();
      }
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-indigo-500">
              {props.channel?.name}
            </span>
            ? This cannot be undone and will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
          <div className="flex w-full items-center justify-between">
            <Button
              disabled={isPending}
              onClick={onClose}
              variant="ghost"
              className="dark:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() =>
                deleteChannel({
                  serverId: props.server!.id,
                  channelId: props.channel!.id,
                })
              }
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
