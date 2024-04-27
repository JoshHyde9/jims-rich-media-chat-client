import type { Channel, ChannelType } from "@prisma/client";
import type {
  QueryParamsKeys,
  ServerWithMembersWithProfiles,
} from "~/lib/types";

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
  | "serverProfile"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

type ModalProps = {
  server?: ServerWithMembersWithProfiles;
  channelType?: ChannelType;
  channel?: Channel;
  userId?: string;
  query?: Record<QueryParamsKeys, string>;
  messageId?: string;
  serverId?: string;
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
