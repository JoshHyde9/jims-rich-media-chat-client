"use client";
import type z from "zod";
import type { QueryParamsKeys } from "~/lib/types";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { api } from "~/trpc/react";

import { useModal } from "~/hooks/useModalStore";

import { sendMessageSchema } from "~/lib/schema";

import { EmojiPicker } from "./EmojiPicker";

import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

type ChatInputProps = {
  queryParams: Record<QueryParamsKeys, string>;
  name: string;
  type: "conversation" | "channel";
};

export const ChatInput = ({ name, queryParams, type }: ChatInputProps) => {
  const { onOpen } = useModal();

  const form = useForm({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      imageUrl: "",
      channelId: "",
      serverId: "",
      content: "",
    },
  });

  useEffect(() => {
    if (queryParams) {
      form.setValue("channelId", queryParams.channelId);
      form.setValue("serverId", queryParams.serverId);
    }
  }, [form, queryParams]);

  const { mutate: createMessage } = api.message.create.useMutation({
    onSuccess: () => {
      form.reset();
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof sendMessageSchema>) => {
    createMessage(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() =>
                      onOpen("messageFile", { query: queryParams })
                    }
                    className="dark:zinc-400 absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="border-0 border-none bg-zinc-200/90 px-14 py-6 text-base text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    placeholder={`Message ${type === "conversation" ? name : `#${name}`}`}
                    {...field}
                  />
                  <div className="absolute right-8 top-7">
                    <EmojiPicker
                      onChange={(emoji) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
