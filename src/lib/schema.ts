import { MemberRole } from "@prisma/client";
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
