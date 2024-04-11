import * as z from "zod";

export const createNewServerSchema = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  imageUrl: z.string().min(1, { message: "Server image is required." }),
});

export const idSchema = z.object({
  id: z.string().min(1, { message: "Id is required." }),
});
