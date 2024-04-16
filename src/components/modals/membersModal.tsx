"use client";

import type { ServerWithMembersWithProfiles } from "~/lib/types";

import { useModal } from "~/hooks/useModalStore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UserAvatar } from "~/components/userAvatar";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

export const MembersModal = () => {
  const { isOpen, onClose, type, props } = useModal();

  const server = props.server as ServerWithMembersWithProfiles;

  const isModalOpen = isOpen && type === "members";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black dark:bg-[#2b2d31] dark:text-primary">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members.map((member) => (
            <div key={member.id} className="mb-6 flex items-center gap-x-2">
              <UserAvatar src={member.user.image} />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center text-sm font-semibold">
                  {member.nickname ?? member.user.name}
                  {roleIconMap[member.role]}
                </div>
                {member.nickname && (
                  <p className="text-xs text-zinc-500">{member.user.name}</p>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
