import { z } from "zod";
import { TRPCError } from "@trpc/server";

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid input!",
    });
  }
  return result.data;
}
