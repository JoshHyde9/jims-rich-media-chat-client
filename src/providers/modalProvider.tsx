"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "~/components/modals/createServerModal";
import { UpdateServerModal } from "~/components/modals/updateServerModal";
import { InviteModal } from "~/components/modals/inviteModal";

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
    </>
  );
};
