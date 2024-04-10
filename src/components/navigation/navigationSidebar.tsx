import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

import { NavigationAction } from "./navigationAction";
import { NavigationItem } from "./navigationItem";

import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { ModeToggle } from "../ModeToggle";

export const NavigationSidebar = async () => {
  const session = await getServerAuthSession();
  const userServers = await api.server.getUserServers();

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 bg-zinc-200 py-3 text-primary dark:bg-[#1E1F22]">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className="w-full flex-1">
        {userServers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.image}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="flex-items-center-flex-col mt-auto gap-y-4 pb-3">
        <ModeToggle />
      </div>
    </div>
  );
};
