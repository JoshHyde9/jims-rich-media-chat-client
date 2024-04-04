/* eslint-disable @typescript-eslint/no-empty-function */

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerAuthSession } from "~/server/auth";

const f = createUploadthing();

const auth = async () => {
  const session = await getServerAuthSession();

  if (!session) throw new Error("Unauthorized");

  return { userId: session.user.id };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await auth())
    .onUploadComplete(() => {}),
  messageFile: f(["image", "pdf"])
    .middleware(async () => await auth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
