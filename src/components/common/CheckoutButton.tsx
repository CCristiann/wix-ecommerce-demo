"use client";

import { api } from "~/trpc/react";
import { Button, ButtonProps } from "../ui/shadcn/button";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "~/hooks/use-toast";

interface CheckoutButtonProps extends ButtonProps {}

export default function CheckoutButton({ ...props }: CheckoutButtonProps) {
  const {
    mutate: getCheckoutUrl,
    data,
    isPending,
  } = api.payments.getCheckoutUrlFromCurrentCart.useMutation({
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: err.message,
      });
    },
    onSuccess(data: any) {
      if (data?.checkoutUrl) window.location.href = data.checkoutUrl;
    },
  });

  return (
    <Button disabled={isPending} onClick={() => getCheckoutUrl()} {...props}>
      {isPending ? (
        <LuLoader2 className="size-5 animate-spin" />
      ) : (
        <span>Checkout</span>
      )}
    </Button>
  );
}
