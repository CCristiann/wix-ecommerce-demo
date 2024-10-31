import { validateSchema } from "~/lib/zod";
import {
  GenerateOAuthDataSchema,
  LoginSchema,
  RegisterSchema,
  TGenerateOAuthDataSchema,
  TLoginSchema,
  TRegisterSchema,
} from "./auth.service.types";
import { wixBrowserClient } from "~/lib/wix-client.browser";
import { env } from "~/type-safe-env";

import { TRPCError } from "@trpc/server";
import { members } from "@wix/members";

import { WixClient } from "~/lib/wix-client.base";

class AuthService {
  public async login(wixClient: WixClient, args: TLoginSchema) {
    const { email, password } = validateSchema(LoginSchema, args);

    try {
      const res = await wixClient.auth.login({
        email,
        password,
      });

      return res;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to log in. Please try again later.",
      });
    }
  }

  public async logout(wixClient: WixClient) {
    try {
      const { logoutUrl } = await wixClient.auth.logout(
        env.NEXT_PUBLIC_BASE_URL,
      );

      return { logoutUrl };
    } catch (err) {
      console.log(err);
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to log out. Please try again later.",
      });
    }
  }

  public async register(wixClient: WixClient, args: TRegisterSchema) {
    const { email, password } = validateSchema(RegisterSchema, args);

    try {
      await wixClient.auth.register({
        email,
        password,
      });

      return { redirectUrl: "/" };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to register. Please try again later.",
      });
    }
  }

  public async getLoggedInMember(wixClient: WixClient) {
    if (!wixClient.auth.loggedIn) return null;

    try {
      const memberData = await wixClient.members.getCurrentMember({
        fieldsets: [members.Set.FULL],
      });

      return memberData.member ? memberData.member : null;
    } catch (err) {
      if ((err as any).details.applicationError?.code === "PERMISSION_DENIED") {
        return null;
      }
    }
  }
}

export const authService = new AuthService();
