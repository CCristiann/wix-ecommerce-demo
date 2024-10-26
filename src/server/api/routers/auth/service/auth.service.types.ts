import { z } from "zod";

export const GenerateOAuthDataSchema = z.object({
  originPath: z.string({ message: "Invalid origin path provided" }).optional(),
});
export type TGenerateOAuthDataSchema = z.infer<typeof GenerateOAuthDataSchema>;

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email provided" }),
  password: z.string().min(8),
})
export type TLoginSchema = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email provided" }),
  password: z.string().min(8),
})
export type TRegisterSchema = z.infer<typeof RegisterSchema>;