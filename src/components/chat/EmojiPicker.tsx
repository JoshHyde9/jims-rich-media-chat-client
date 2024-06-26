"use client";

import { useTheme } from "next-themes";
import { Smile } from "lucide-react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

// Package types suck ass
type Emoji = {
  id: string;
  name: string;
  native: string;
  unified: string;
  shortcodes: string;
  keywords: string[];
  aliases: string[];
};

type EmojiPickerProps = {
  onChange: (value: string) => void;
};

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: Emoji) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
