import { createTRPCRouter, publicProcedure } from "../../trpc";
import { authService } from "./service/auth.service";
import { LoginSchema, RegisterSchema } from "./service/auth.service.types";

export const authRouter = createTRPCRouter({
    login: publicProcedure.input(LoginSchema).mutation(({ ctx, input }) => {
        return authService.login(ctx.wixClient,input);
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
        return authService.logout(ctx.wixClient);
    }),
    register: publicProcedure.input(RegisterSchema).mutation(({ ctx, input }) => {
        return authService.register(ctx.wixClient, input);
    }),
    getLoggedInMember: publicProcedure.query(({ ctx }) => {
        return authService.getLoggedInMember(ctx.wixClient);
    })
})