"use client";

import type { MemberRole } from "@prisma/client";
import type { ServerWithMembersWithProfiles } from "~/lib/types";

import { useState } from "react";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import { useModal } from "~/hooks/useModalStore";

import { api } from "~/trpc/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuContent,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UserAvatar } from "~/components/userAvatar";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

export const MembersModal = () => {
  const { isOpen, onClose, onOpen, type, props } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const server = props.server as ServerWithMembersWithProfiles;

  const isModalOpen = isOpen && type === "members";

  const { mutate: updateMemberRole } = api.members.updateMemberRole.useMutation(
    {
      onSuccess: (data) => {
        onOpen("members", { server: data });

        setLoadingId("");
      },
    },
  );

  const onUpdateMemberRole = (
    memberId: string,
    serverId: string,
    role: MemberRole,
  ) => {
    setLoadingId(memberId);
    updateMemberRole({
      memberId: memberId,
      serverId: serverId,
      role,
    });
  };

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
              {server?.userId !== member.userId && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex cursor-pointer items-center">
                          <ShieldQuestion className="mr-2 h-4 w-4" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  onUpdateMemberRole(
                                    member.id,
                                    server.id,
                                    "GUEST",
                                  )
                                }
                              >
                                Guest
                              </DropdownMenuItem>
                              {member.role === "GUEST" && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  onUpdateMemberRole(
                                    member.id,
                                    server.id,
                                    "MODERATOR",
                                  )
                                }
                              >
                                Moderator
                              </DropdownMenuItem>
                              {member.role === "MODERATOR" && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Gavel className="mr-2 h-4 w-4" /> Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
