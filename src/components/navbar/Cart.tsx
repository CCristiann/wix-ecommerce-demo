"use client";

import { api } from "~/trpc/react";
import { Button } from "../ui/shadcn/button";
import Link from "next/link";
import { LucideShoppingCart } from "lucide-react";
import { Badge } from "../ui/shadcn/badge";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/shadcn/sheet";
import { currentCart } from "@wix/ecom";
import WixImage from "../common/WixImage";
import { LuLoader2, LuShoppingBag, LuTrash2 } from "react-icons/lu";
import { toast } from "~/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import CheckoutButton from "../common/CheckoutButton";

export default function Cart() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data: cart, isLoading, isFetching } = api.cart.getCart.useQuery();

  const totalQuantity =
    cart?.lineItems.reduce(
      (acc: number, item: currentCart.LineItem) => acc + (item.quantity || 0),
      0,
    ) || 0;

  const invalidateGetCartQuery = (cartData?: currentCart.Cart) => {};

  return (
    <>
      <Button
        variant={"ghost"}
        size={"sm"}
        onClick={() => setSheetOpen(!sheetOpen)}
        className="relative"
      >
        <span className="relative flex flex-col items-center space-y-1">
          <LuShoppingBag className="size-6 text-muted-foreground" />
          <span className="hidden lg:block text-xs font-medium">Cart</span>
        </span>
        {!isLoading && cart && (
          <div className="absolute bg-[#edcf5d] rounded-full flex items-center justify-center text-xs p-0.5 size-4 right-1 -top-1">
            {totalQuantity}
          </div>
        )}
      </Button>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex w-screen flex-col sm:max-w-lg md:w-[unset]">
          <SheetHeader>
            <SheetTitle>
              Your cart{" "}
              <span className="text-base">
                ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex grow flex-col space-y-5 overflow-y-auto">
            <ul className="space-y-5">
              {cart?.lineItems.map((item: currentCart.LineItem, i: number) => (
                <CartItem
                  key={i}
                  item={item}
                  onProductLinkClicked={() => setSheetOpen(!sheetOpen)}
                />
              ))}
            </ul>

            {isLoading && (
              <div className="flex grow items-center justify-center">
                <LuLoader2 className="size-6 animate-spin" />
              </div>
            )}

            {!isLoading && !cart?.lineItems.length && (
              <div className="flex grow items-center justify-center text-center">
                <div className="space-y-1.5">
                  <p className="text-lg font-semibold">Your cart is empty</p>
                  <Link
                    href={"/shop"}
                    className="text-center transition hover:text-muted-foreground hover:underline"
                  >
                    Start shopping!
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bottom cart section */}
          <div className="flex items-center justify-between gap-5">
            <div className="space-y-0.5">
              <p className="text-sm">Subtotal amount</p>
              <p className="font-bold">
                {cart?.subtotal?.formattedConvertedAmount}
              </p>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
            </div>
            <CheckoutButton
              size={"lg"}
              disabled={!totalQuantity || isFetching}
              className="min-w-32"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface CartItemProps {
  item: currentCart.LineItem;
  onProductLinkClicked: () => void;
}

function CartItem({ item, onProductLinkClicked }: CartItemProps) {
  const queryClient = useQueryClient();
  const utils = api.useUtils();

  const { mutate: updateCartItemQuantity, isPending: updatingQuantity } =
    api.cart.updateCartItemQuantity.useMutation({
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Failed to update quantity",
          description: "Something went wrong updating product quantity.",
        });
      },
      onSettled: async (data) => {
        await utils.cart.getCart.cancel();
        utils.cart.getCart.setData(undefined, data?.cart);
      },
    });

  const { mutate: removeCartItemQuantity, isPending: removingCartItem } =
    api.cart.removeCartItem.useMutation({
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Failed to remove product",
          description: "Something went wrong removing product from your cart.",
        });
      },
      onSettled: async (data) => {
        await utils.cart.getCart.cancel();
        utils.cart.getCart.setData(undefined, data?.cart);
      },
    });

  const productId = item._id;
  if (!productId) return null;

  const slug = item.url?.split("/").pop();

  const quantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable;

  return (
    <li className="flex items-center gap-3">
      <Link href={`/products/${slug}`} onClick={onProductLinkClicked}>
        <WixImage
          mediaIdentifier={item.image}
          width={110}
          height={110}
          alt={item.productName?.translated || "Product image"}
          className="flex-none rounded-2xl bg-secondary"
        />
      </Link>
      <div className="grow space-y-1.5 text-sm">
        <Link
          href={`/products/${slug}`}
          onClick={onProductLinkClicked}
          className="font-semibold"
        >
          <p>{item.productName?.translated || "Item"} </p>
        </Link>
        {!!item.descriptionLines?.length && (
          <p>
            {item.descriptionLines
              .map(
                (line) =>
                  line.colorInfo?.translated || line.plainText?.translated,
              )
              .join(", ")}
          </p>
        )}
        <div className="flex items-center gap-2">
          {item.quantity} x {item.price?.formattedConvertedAmount}
          {item.fullPrice && item.fullPrice.amount !== item.price?.amount && (
            <span className="text-muted-foreground line-through">
              {item.fullPrice.formattedConvertedAmount}
            </span>
          )}
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              variant={"outline"}
              size={"xs"}
              disabled={item.quantity === 1 || updatingQuantity}
              onClick={() =>
                updateCartItemQuantity({
                  productId,
                  newQuantity: !item.quantity ? 0 : item.quantity - 1,
                })
              }
            >
              -
            </Button>
            <span>{item.quantity}</span>
            <Button
              variant={"outline"}
              size={"xs"}
              disabled={quantityLimitReached || updatingQuantity}
              onClick={() =>
                updateCartItemQuantity({
                  productId,
                  newQuantity: !item.quantity ? 0 : item.quantity + 1,
                })
              }
            >
              +
            </Button>
            {quantityLimitReached && <span>Quantity limit reached</span>}
          </div>

          <Button
            variant={"outline"}
            size="xs"
            onClick={() => removeCartItemQuantity({ productId })}
          >
            {removingCartItem ? (
              <LuLoader2 className="size-5 animate-spin" />
            ) : (
              <LuTrash2 className="size-5" />
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}
