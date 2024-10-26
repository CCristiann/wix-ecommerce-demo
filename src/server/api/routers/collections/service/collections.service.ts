import { getWixServerClient } from "~/lib/wix-client.server";
import {
  GetCollectionBySlugSchema,
  TGetCollectionBySlugSchema,
} from "./collections.service.types";
import { validateSchema } from "~/lib/zod";
import { cache } from "react";
import { WixClient } from "~/lib/wix-client.base";

class CollectionsService {
  public getCollectionBySlug = cache(async (wixClient: WixClient, args: TGetCollectionBySlugSchema) => {
    const { slug } = validateSchema(GetCollectionBySlugSchema, args);

    const { collection } = await wixClient.collections.getCollectionBySlug(slug);

    return collection
  })
  public getCollections = cache(async (wixClient: WixClient) => {
    const collections = await wixClient.collections
      .queryCollections()
      .ne("_id", "00000000-000000-000000-000000000001")
      .ne("_id", "ce571433-57f2-1b29-c4e5-617f6ef44305")
      .find();

    return collections.items;
  })
}

export const collectionsService = new CollectionsService();
