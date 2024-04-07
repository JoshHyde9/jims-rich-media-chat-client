"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import { ActionTooltip } from "../actionTooltip";

import { cn } from "~/lib/utils";

type NavigationItemProps = {
  id: string;
  imageUrl: string;
  name: string;
};

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <ActionTooltip label={name} align="center" side="right">
      <button
        onClick={() => {
          router.push(`/server/${id}`);
        }}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 w-[4px] rounded-r-full bg-primary transition-all",
            params.serverId !== id && "group-hover:h-[20px]",
            params.serverId === id ? "h-[36px]" : "h-[8px]",
          )}
        />
        <div
          className={cn(
            "group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]",
            params.serverId === id &&
              "rounded-[16px] bg-primary/10 text-primary",
          )}
        >
          <Image src={imageUrl} fill alt="Server" />
        </div>
      </button>
    </ActionTooltip>
  );
};
