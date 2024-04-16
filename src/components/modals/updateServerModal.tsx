"use client";
import type z from "zod";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/trpc/react";
import { updateServerSettingsSchema } from "~/lib/schema";

import { FileUpload } from "../fileUpload";

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
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/useModalStore";

export const UpdateServerModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();

  const { mutate: updateServer } = api.server.updateServerSettings.useMutation({
    onSuccess: async () => {
      form.reset();
      router.refresh();
      onClose();
    },
  });

  const isModalOpen = isOpen && type === "editServer";
  const { server } = props;

  const form = useForm({
    resolver: zodResolver(updateServerSettingsSchema),
    defaultValues: {
      id: "",
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("id", server.id);
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.image);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (
    values: z.infer<typeof updateServerSettingsSchema>,
  ) => {
    updateServer(values);
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
            Customise Your Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 dark:text-primary/70">
            Update your server&apos;s image and name to give it a fresh look.
          </DialogDescription>
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
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-primary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-primary/80"
                        placeholder="Server name..."
                        {...field}
                      />
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
