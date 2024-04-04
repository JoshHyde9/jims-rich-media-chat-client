import { redirect } from "next/navigation";

import { db } from "~/server/db";

import { initailUser } from "~/lib/initialUser";

import { InitialModal } from "~/components/modals/initialModal";

const SetupPage = async () => {
  const user = await initailUser();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          userId: user?.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
