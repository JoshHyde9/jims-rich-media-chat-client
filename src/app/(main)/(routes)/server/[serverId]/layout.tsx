import { redirect } from "next/navigation";

import { ServerSidebar } from "~/components/server/serverSidebar";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/login");
  }

  const server = await api.server.getById({ id: params.serverId });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-64 flex-col md:flex">
        <ServerSidebar serverId={server.id} />
      </div>
      <main className="h-full md:pl-64">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
