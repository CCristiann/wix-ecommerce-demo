"use client";

import { products } from "@wix/stores";
import { Button, ButtonProps } from "../ui/shadcn/button";
import { useMutation } from "@tanstack/react-query";
import { TCreateBackInStockNotificationReq } from "~/server/api/routers/products/service/products.service.types";
import { productsService } from "~/server/api/routers/products/service/products.service";
import { toast } from "~/hooks/use-toast";
import { TRPCErrorShape } from "@trpc/server/rpc";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/shadcn/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/shadcn/form";

import { Input } from "../ui/shadcn/input";
import { LuLoader2 } from "react-icons/lu";
import { env } from "~/type-safe-env";

const FormSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});
type TFormValues = z.infer<typeof FormSchema>;

interface BackInStockButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
}

export default function BackInStockButton({
  product,
  selectedOptions,
  ...props
}: BackInStockButtonProps) {
  const form = useForm<TFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(FormSchema),
  });
  const { mutate: createBackInStockNotificationReq, isPending } = useMutation({
    mutationFn: (values: TCreateBackInStockNotificationReq) =>
      productsService.createBackInStockNotificationReq(values),
    onError: (err: TRPCErrorShape) => {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: err.message,
      });
    },
    onSuccess: (data) => {
      form.reset();
      toast({
        title: "Good news!",
        description: "We'll notify you when this product is back in stock.",
      });
    },
  });

  const onSubmit = async (values: TFormValues) => {
    createBackInStockNotificationReq({
      product,
      email: values.email,
      selectedOptions,
      itemUrl: env.NEXT_PUBLIC_BASE_URL + "/products/" + product.slug,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>Notify when available</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notify when available</DialogTitle>
          <DialogDescription>
            Enter your email address and we&apos;ll notify you when the product
            is back in stock.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

            <Button type="submit" className="!w-full">
              {isPending ? (
                <LuLoader2 className="size-5 animate-spin" />
              ) : (
                <span>Notify Me</span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
