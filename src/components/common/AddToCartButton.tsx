"use client";

import { products } from "@wix/stores";
import { Button, ButtonProps } from "../ui/shadcn/button";
import { cartService } from "~/server/api/routers/cart/service/cart.service";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/trpc/react";
import { LuLoader2, LuShoppingBag } from "react-icons/lu";
import { toast } from "~/hooks/use-toast";
import clsx from "clsx";

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
  customVariant?: "icon-only" | "icon-text"; // Le nostre varianti personalizzate
}

export default function AddToCartButton({
  product,
  selectedOptions,
  quantity,
  className,
  customVariant = "icon-text", // Default alla variante con icona e testo
  ...props
}: AddToCartButtonProps) {
  const utils = api.useUtils();

  const { data, isPending, mutate } = useMutation({
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
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutate();
      }}
      className={clsx(className, "flex items-center", {
        "gap-2": customVariant === "icon-text", // Aggiunge spazio tra icona e testo solo per "icon-text"
        "justify-center": customVariant === "icon-only", // Centra l'icona per la variante "icon-only"
      })}
      {...props}
      disabled={isPending}
    >
      {isPending ? (
        <span>
          <LuLoader2 className="size-5 animate-spin" />
        </span>
      ) : (
        <>
          <LuShoppingBag className="size-5" />
          {customVariant === "icon-text" && <span>Add to cart</span>}
        </>
      )}
    </Button>
  );
}
