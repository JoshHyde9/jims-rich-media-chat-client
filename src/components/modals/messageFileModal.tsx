"use client";
import type z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/trpc/react";
import { messageFileSchema } from "~/lib/schema";

import { FileUpload } from "../fileUpload";

import { useModal } from "~/hooks/useModalStore";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";

export const MessageFileModal = () => {
  const { isOpen, onClose, props, type } = useModal();

  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(messageFileSchema),
    defaultValues: {
      serverId: "",
      channelId: "",
      content: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (props.query) {
      form.setValue("serverId", props.query.serverId);
      form.setValue("channelId", props.query.channelId);
    }
  }, [props, form]);

  const { mutate: createMessage } = api.message.create.useMutation({
    onSuccess: () => {
      form.reset();
      onClose();
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof messageFileSchema>) => {
    createMessage({
      imageUrl: values.imageUrl,
      content: values.imageUrl,
      channelId: form.getValues("channelId"),
      serverId: form.getValues("serverId"),
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Send an Attachment
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
              <Button disabled={isLoading} variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
