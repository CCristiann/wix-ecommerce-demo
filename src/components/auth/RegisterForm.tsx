"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type TRegisterSchema } from "~/server/api/routers/auth/service/auth.service.types";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/shadcn/input";
import { Button } from "../ui/shadcn/button";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "~/hooks/use-toast";
import CardWrapper from "./CardWrapper";

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: register, isPending } = api.auth.register.useMutation({
    onSuccess: (data) => {
      if (data?.redirectUrl) router.push(data.redirectUrl);
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: err.message,
      });
    },
  });

  const onSubmit = (values: TRegisterSchema) => {
    register(values);
  };

  return (
    <CardWrapper title="Create an account">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="!w-full">
            {isPending ? (
              <LuLoader2 className="size-5 animate-spin" />
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
