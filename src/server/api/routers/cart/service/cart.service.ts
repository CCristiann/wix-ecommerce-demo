import { TRPCError } from "@trpc/server";
import {
  AddToCartProps,
  RemoveCartItemSchema,
  TRemoveCartItem,
  TUpdateCartItemQuantity,
  UpdateCartItemQuantitySchema,
} from "./cart.service.types";
import { findVariant } from "~/lib/findVariant";
import { WIX_STORES_APP_ID } from "~/lib/costants";
import { getWixServerClient } from "~/lib/wix-client.server";
import { wixBrowserClient } from "~/lib/wix-client.browser";
import { validateSchema } from "~/lib/zod";
import { WixClient } from "~/lib/wix-client.base";

class CartService {
  public async getCart(wixClient: WixClient) {
    try {
      const cart = await wixClient.currentCart.getCurrentCart();
      return cart
    } catch (err) {
      if ((err as any).details.applicationError.code === "OWNED_CART_NOT_FOUND")
        return null;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong!",
      });
    }
  }

  public async addToCart({
    product,
    selectedOptions,
    quantity,
  }: AddToCartProps) {
    const wixClient = wixBrowserClient;
    const selectedVariant = findVariant(product, selectedOptions);

    return wixClient.currentCart.addToCurrentCart({
      lineItems: [
        {
          catalogReference: {
            appId: WIX_STORES_APP_ID,
            catalogItemId: product._id,
            options: selectedVariant
              ? {
                  variantId: selectedVariant._id,
                }
              : { options: selectedOptions },
          },
          quantity,
        },
      ],
    });
  }

  public async updateCartItemQuantity(wixClient: WixClient,args: TUpdateCartItemQuantity) {
    const { productId, newQuantity } = validateSchema(
      UpdateCartItemQuantitySchema,
      args
    );

    return wixClient.currentCart.updateCurrentCartLineItemQuantity([
      {
        _id: productId,
        quantity: newQuantity,
      },
    ]);
  }

  public async removeCartItem(wixClient: WixClient, args: TRemoveCartItem) {
    const { productId } = validateSchema(RemoveCartItemSchema, args);
    
    return wixClient.currentCart.removeLineItemsFromCurrentCart([productId]);
  }
}

export const cartService = new CartService();
