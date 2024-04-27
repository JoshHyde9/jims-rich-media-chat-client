import { ChannelType, MemberRole } from "@prisma/client";
import * as z from "zod";

export const createNewServerSchema = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  imageUrl: z.string().min(1, { message: "Server image is required." }),
});

export const idSchema = z.object({
  id: z.string().min(1, { message: "Id is required." }),
});

export const updateServerSettingsSchema = createNewServerSchema.extend({
  id: z.string().min(1, { message: "Id is required." }),
});

export const inviteCodeSchema = z.object({
  inviteCode: z.string().min(1, { message: "Invite code is required." }),
});

export const updateMemberRoleSchema = z.object({
  serverId: z.string().min(1, { message: "Server id is required." }),
  memberId: z.string().min(1, { message: "Member id is required." }),
  role: z.nativeEnum(MemberRole),
});

export const kickMemberSchema = z.object({
  serverId: z.string().min(1, { message: "Server id is required." }),
  memberId: z.string().min(1, { message: "Member id is required." }),
});

export const createChannelSchema = z.object({
  serverId: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "Channel name is required." })
    .refine((name) => name !== "general", {
      message: 'Channel name cannot be "general".',
    }),
  type: z.nativeEnum(ChannelType),
});

export const updateMemberNicknameSchema = z.object({
  nickname: z.string().optional(),
  serverId: z.string().min(1, { message: "Server id is required." }),
  memberId: z.string().min(1, { message: "Member id is required." }),
});

export const deleteChannelSchema = z.object({
  serverId: z.string().min(1, { message: "Server id is required." }),
  channelId: z.string().min(1, { message: "Channel id is required." }),
});

export const updateChannelSchema = z.object({
  serverId: z.string().min(1, { message: "Server id is required." }),
  channelId: z.string().min(1, { message: "Channel id is required." }),
  name: z
    .string()
    .min(1, { message: "Channel name is required." })
    .refine((name) => name !== "general", {
      message: 'Channel name cannot be "general".',
    }),
  type: z.nativeEnum(ChannelType),
});

export const initialConversationSchema = z.object({
  memberOneId: z.string().min(1, { message: "MemberOne id is required." }),
  memberTwoId: z.string().min(1, { message: "MemberTwo id is required." }),
});

export const sendMessageSchema = z.object({
  serverId: z.string().min(1, { message: "Server id is required." }),
  imageUrl: z.string().optional(),
  channelId: z.string().min(1, { message: "Channel id is required." }),
  content: z.string().min(1),
});

export const messageFileSchema = z.object({
  imageUrl: z.string().min(1, { message: "Attachment is required." }),
});
