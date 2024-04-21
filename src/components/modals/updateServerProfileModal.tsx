"use client";
import type z from "zod";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/trpc/react";

import { useModal } from "~/hooks/useModalStore";

import { updateMemberNicknameSchema } from "~/lib/schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useEffect } from "react";

export const UpdateServerProfileModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "serverProfile";

  const { mutate: updateMemberNickname, isPending } =
    api.members.updateMemberNickname.useMutation({
      onSuccess: async () => {
        form.reset();
        router.refresh();
        onClose();
      },
    });

  const form = useForm({
    resolver: zodResolver(updateMemberNicknameSchema),
    defaultValues: {
      nickname: "",
      memberId: "",
      serverId: "",
    },
  });

  const loggedInUserServerMember = props.server?.members.filter(
    (member) => member.userId === props.userId,
  )[0];

  useEffect(() => {
    if (props.server && loggedInUserServerMember) {
      form.setValue("nickname", loggedInUserServerMember.nickname ?? "");
      form.setValue("memberId", loggedInUserServerMember.id);
      form.setValue("serverId", props.server.id);
    }
  }, [form, props.userId, props.server, loggedInUserServerMember]);

  const onSubmit = async (
    values: z.infer<typeof updateMemberNicknameSchema>,
  ) => {
    updateMemberNickname(values);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Update Server Profile
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Customise your preferences and profile details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-primary/70">
                      Server Nickname
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        className="border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-primary/80"
                        placeholder="Server nickname..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
              <Button disabled={isPending} variant="primary">
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
