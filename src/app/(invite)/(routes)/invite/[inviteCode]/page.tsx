import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

type InviteCodePageProps = {
  params: {
    inviteCode: string;
  };
};

export const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/login");
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await api.server.getServerByInviteCode({
    inviteCode: params.inviteCode,
  });

  if (existingServer) {
    return redirect(`/server/${existingServer.id}`);
  }

  const server = await api.server.addNewMember({
    inviteCode: params.inviteCode,
  });

  return redirect(`/server/${server.id}`);

  return null;
};

export default InviteCodePage;
