import { env } from "~/type-safe-env";
import { getWixServerClient } from "~/lib/wix-client.server";
import { TRPCError } from "@trpc/server";
import { checkout } from "@wix/ecom";
import { TGetCheckoutUrlFromProduct } from "./payments.service.types";
import { findVariant } from "~/lib/findVariant";
import { WIX_STORES_APP_ID } from "~/lib/costants";
import { WixClient } from "~/lib/wix-client.base";

class PaymentsService {
  public async getCheckoutUrlFromCurrentCart(wixClient: WixClient) {
    const { checkoutId } =
      await wixClient.currentCart.createCheckoutFromCurrentCart({
        channelType: checkout.ChannelType.WEB,
      });

    const { redirectSession } = await wixClient.redirects.createRedirectSession(
      {
        ecomCheckout: { checkoutId },
        callbacks: {
          postFlowUrl: window.location.href,
          thankYouPageUrl: env.NEXT_PUBLIC_BASE_URL + "/thank-you",
        },
      }
    );

    if (!redirectSession)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failted to create redirect session",
      });

    return { checkoutUrl: redirectSession.fullUrl };
  }

  public async getCheckoutUrlFromProduct(wixClient: WixClient, args: TGetCheckoutUrlFromProduct) {
    const { product, selectedOptions, quantity } = args;

    const selectedVariant = findVariant(product, selectedOptions);

    const { _id } = await wixClient.checkout.createCheckout({
      channelType: checkout.ChannelType.WEB,
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

    if (!_id)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout",
      });

    const { redirectSession } = await wixClient.redirects.createRedirectSession(
      {
        ecomCheckout: { checkoutId: _id },
        callbacks: {
          postFlowUrl: window.location.href,
          thankYouPageUrl: env.NEXT_PUBLIC_BASE_URL + "/thank-you",
        },
      }
    );

    if (!redirectSession)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failted to create redirect session",
      });

    return { checkoutUrl: redirectSession.fullUrl };
  }
}

export const paymentsService = new PaymentsService();
