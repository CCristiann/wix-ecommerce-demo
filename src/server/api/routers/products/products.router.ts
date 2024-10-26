import { publicProcedure } from "../../trpc";
import { productsService } from "./service/products.service";
import { GetProductBySlugSchema, GetRelatedProductsSchema, QueryProductsSchema } from "./service/products.service.types";
import { createTRPCRouter } from "../../trpc";

export const productsRouter = createTRPCRouter({
    queryProducts: publicProcedure.input(QueryProductsSchema).query(({ ctx, input }) => {
        return productsService.queryProducts(ctx.wixClient, input);
    }),
    getFeaturedProducts: publicProcedure.query(({ ctx }) => {
        return productsService.getFeaturedProducts(ctx.wixClient);
    }),
    getProductBySlug: publicProcedure.input(GetProductBySlugSchema).query(({ ctx, input }) => {
        return productsService.getProductBySlug(ctx.wixClient, input);
    }),
    getRelatedProducts: publicProcedure.input(GetRelatedProductsSchema).query(({ ctx, input }) => {
        return productsService.getRelatedProducts(ctx.wixClient, input);
    })
})