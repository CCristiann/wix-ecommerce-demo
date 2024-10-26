"use client";

import { Button, ButtonProps } from "../ui/shadcn/button";
import { toast } from "~/hooks/use-toast";
import { LuLoader2 } from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import { paymentsService } from "~/server/api/routers/payments/service/payments.service";
import { products } from "@wix/stores";

interface BuyNowButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export default function BuyNowButton({
  product,
  selectedOptions,
  quantity,
  ...props
}: BuyNowButtonProps) {
  const { mutate: getCheckoutUrl, isPending } = useMutation({
    mutationKey: ["get-checkout-url-from-product"],
    mutationFn: paymentsService.getCheckoutUrlFromProduct,
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description:
          (err as any).message
      });
    },
    onSuccess({ checkoutUrl }) {
      if (checkoutUrl) window.location.href = checkoutUrl;
    },
  });

  return (
    <Button
      {...props}
      variant={"outline"}
      onClick={() => getCheckoutUrl({ product, selectedOptions, quantity })}
    >
      {isPending ? (
        <LuLoader2 className="size-5 animate-spin" />
      ) : (
        <span>Buy now</span>
      )}
    </Button>
  );
}
