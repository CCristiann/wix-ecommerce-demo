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
import { LoginSchema, type TLoginSchema } from "~/server/api/routers/auth/service/auth.service.types";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/shadcn/input";
import { Button } from "../ui/shadcn/button";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "~/hooks/use-toast";
import { LoginState } from "@wix/sdk";
import { wixBrowserClient } from "~/lib/wix-client.browser";
import { WIX_SESSION_COOKIE } from "~/lib/costants";

import Cookies from "js-cookie";
import CardWrapper from "./CardWrapper";

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = api.auth.login.useMutation({
    onSuccess: async (res) => {
      switch (res.loginState) {
        case LoginState.SUCCESS:
          const tokens =
            await wixBrowserClient.auth.getMemberTokensForDirectLogin(
              res.data.sessionToken
            );
          Cookies.set(WIX_SESSION_COOKIE, JSON.stringify(tokens));
          wixBrowserClient.auth.setTokens(tokens);
          router.push("/");
      }
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: err.message,
      });
    },
  });

  const onSubmit = (values: TLoginSchema) => {
    login(values);
  };

  return (
    <CardWrapper title="Welcome back!">
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
