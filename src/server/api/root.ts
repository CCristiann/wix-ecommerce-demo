import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth/auth.router";
import { paymentsRouter } from "./routers/payments/payments.router";
import { productsRouter } from "./routers/products/products.router";
import { cartRouter } from "./routers/cart/cart.router";
import { collectionsRouter } from "./routers/collections/collections.router";
import { reviewsRouter } from "./routers/reviews/reviews.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  payments: paymentsRouter,
  products: productsRouter,
  cart: cartRouter,
  collections: collectionsRouter,
  reviews: reviewsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
