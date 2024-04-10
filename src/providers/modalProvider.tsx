"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "~/components/modals/createServerModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return false;

  return (
    <>
      <CreateServerModal />
    </>
  );
};
