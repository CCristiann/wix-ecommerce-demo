import { publicProcedure } from "../../trpc";
import { cartService } from "./service/cart.service";
import {
  RemoveCartItemSchema,
  UpdateCartItemQuantitySchema,
} from "./service/cart.service.types";
import { createTRPCRouter } from "../../trpc";

export const cartRouter = createTRPCRouter({
  getCart: publicProcedure.query(({ ctx }) => {
    return cartService.getCart(ctx.wixClient);
  }),
  updateCartItemQuantity: publicProcedure
    .input(UpdateCartItemQuantitySchema)
    .mutation(({ ctx, input }) => {
      return cartService.updateCartItemQuantity(ctx.wixClient,input);
    }),
  removeCartItem: publicProcedure
    .input(RemoveCartItemSchema)
    .mutation(({ ctx, input }) => {
      return cartService.removeCartItem(ctx.wixClient, input);
    }),
});
