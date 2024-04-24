"use client";
import type z from "zod";

import { ChannelType } from "@prisma/client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useModal } from "~/hooks/useModalStore";

import { api } from "~/trpc/react";

import { updateChannelSchema } from "~/lib/schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export const UpdateChannelModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();

  const { mutate: updateChannel } = api.channel.update.useMutation({
    onSuccess: async () => {
      form.reset();
      router.refresh();
      onClose();
    },
  });

  const form = useForm({
    resolver: zodResolver(updateChannelSchema),
    defaultValues: {
      serverId: "",
      name: "",
      type: props.channel?.type ?? ChannelType.TEXT,
      channelId: "",
    },
  });

  const isModalOpen = isOpen && type === "editChannel";

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (props.channel) {
      form.setValue("name", props.channel.name);
      form.setValue("type", props.channel.type);
      form.setValue("channelId", props.channel.id);
    }

    if (props.server) {
      form.setValue("serverId", props.server.id);
    }
  }, [form, props]);

  const onSubmit = async (values: z.infer<typeof updateChannelSchema>) => {
    updateChannel(values);
  };

  const handleModalClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Update Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 dark:text-primary/70">
            Update your channel&apos;s name and or type.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-primary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        className="border-0 bg-zinc-300/50 lowercase focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-primary/80"
                        placeholder="Channel name..."
                        onChange={(event) => {
                          field.onChange(
                            event.target.value
                              .replace(/\s+/g, "-")
                              .toLowerCase(),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-primary/70">
                      Channel Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="border-0 bg-zinc-300/50 capitalize focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-primary/70">
                          <SelectValue placeholder="Channel Type" />
                        </SelectTrigger>
                        <SelectContent className="text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-primary/80">
                          {Object.values(ChannelType).map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="cursor-pointer capitalize"
                            >
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
              <Button disabled={isLoading} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
