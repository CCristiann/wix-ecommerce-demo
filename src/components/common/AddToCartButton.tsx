"use client";

import { products } from "@wix/stores";
import { Button, ButtonProps } from "../ui/shadcn/button";
import { cartService } from "~/server/api/routers/cart/service/cart.service";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/trpc/react";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "~/hooks/use-toast";
import { getQueryKey } from "@trpc/react-query";

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export default function AddToCartButton({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: AddToCartButtonProps) {
  const utils = api.useUtils()

  const {
    data,
    isPending,
    mutate,
  } = useMutation({
    mutationKey: ["add-to-cart"],
    mutationFn: async () => {
      const data = await cartService.addToCart({
        product,
        selectedOptions,
        quantity,
      });
      return data;
    },
    onSuccess: async (data) => {
      toast({
        title: "Product added to cart",
        description: "Your product has been added to your cart",
      });
      await utils.cart.getCart.cancel();
      utils.cart.getCart.setData(undefined, data?.cart);
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      className={className}
      {...props}
      disabled={isPending}
    >
      {isPending ? (
        <span>
          <LuLoader2 className="animate-spin size-5" />
        </span>
      ) : (
        "Add to cart"
      )}
    </Button>
  );
}
