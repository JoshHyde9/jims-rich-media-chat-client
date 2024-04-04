import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export const initailUser = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/login");
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });

  if (user) return user;

  return null;
};
