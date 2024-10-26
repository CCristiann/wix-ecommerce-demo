import { createTRPCRouter, publicProcedure } from "../../trpc";
import { collectionsService } from "./service/collections.service";
import { GetCollectionBySlugSchema } from "./service/collections.service.types";

export const collectionsRouter = createTRPCRouter({
  getCollectionBySlug: publicProcedure
    .input(GetCollectionBySlugSchema)
    .query(({ ctx, input }) => {
      return collectionsService.getCollectionBySlug(ctx.wixClient,input);
    }),
  getCollections: publicProcedure.query(({ ctx }) => {
    return collectionsService.getCollections(ctx.wixClient);
  }),
});
