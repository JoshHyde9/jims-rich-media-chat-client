"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "~/components/modals/createServerModal";
import { UpdateServerModal } from "~/components/modals/updateServerModal";
import { InviteModal } from "~/components/modals/inviteModal";
import { MembersModal } from "~/components/modals/membersModal";
import { CreateChannelModal } from "~/components/modals/createChannelModal";
import { LeaveServerModal } from "~/components/modals/leaveServerModal";
import { DeleteServerModal } from "~/components/modals/deleteServerModal";
import { UserSettingsModal } from "~/components/modals/userSettingsModal";
import { UpdateServerProfileModal } from "~/components/modals/updateServerProfileModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return false;

  return (
    <>
      <CreateServerModal />
      <UpdateServerModal />
      <InviteModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <UserSettingsModal />
      <UpdateServerProfileModal />
    </>
  );
};
