import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

type ServerPageProps = {
  params: {
    serverId: string;
  };
};

const ServerPage = async ({ params }: ServerPageProps) => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/login");
  }

  const server = await api.server.getBydIdWithFirstChannel({
    id: params.serverId,
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") return null;

  return redirect(`/server/${server?.id}/channel/${initialChannel.id}`);
};

export default ServerPage;
