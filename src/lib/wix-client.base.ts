import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { products, collections } from "@wix/stores"

import {
    backInStockNotifications,
    checkout,
    currentCart,
    orders,
    recommendations,
} from "@wix/ecom";
import { files } from "@wix/media";
import { members } from "@wix/members";
import { redirects } from "@wix/redirects";
import { reviews } from "@wix/reviews";
import { env } from "~/type-safe-env";

export function getWixClient(tokens: Tokens | undefined) {
    return createClient({
        modules: {
            products,
            collections,
            files,
            members,
            redirects,
            reviews,
            checkout,
            orders,
            recommendations,
            currentCart,
            backInStockNotifications
        },
        auth: OAuthStrategy({
            clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID,
            tokens
        })
    })
}

export type WixClient = ReturnType<typeof getWixClient>;