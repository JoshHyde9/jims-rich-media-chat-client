import type { ChannelType } from "@prisma/client";
import type { ServerWithMembersWithProfiles } from "~/lib/types";

import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "userSettings"
  | "serverProfile";

type ModalProps = {
  server?: ServerWithMembersWithProfiles;
  channelType?: ChannelType;
  userId?: string;
};

type ModalStore = {
  type: ModalType | null;
  props: ModalProps;
  isOpen: boolean;
  onOpen: (type: ModalType, props?: ModalProps) => void;
  onClose: () => void;
};

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  props: {},
  onOpen: (type, props = {}) => set({ isOpen: true, type, props }),
  onClose: () => set({ type: null, isOpen: false }),
}));
