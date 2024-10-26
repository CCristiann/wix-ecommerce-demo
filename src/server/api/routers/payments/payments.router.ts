import { createTRPCRouter, publicProcedure } from "../../trpc";
import { paymentsService } from "./service/payments.service";

export const paymentsRouter = createTRPCRouter({
    getCheckoutUrlFromCurrentCart: publicProcedure.mutation(async ({ ctx }) => {
        return paymentsService.getCheckoutUrlFromCurrentCart(ctx.wixClient)
    })
})