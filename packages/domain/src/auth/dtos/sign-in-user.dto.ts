import { z } from "zod";
import { providerTypesSchema } from "@/auth";

export const signInUserRequestDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  providerType: providerTypesSchema,
});

export type SignInUserRequestDto = z.infer<typeof signInUserRequestDtoSchema>;

export const signInUserResponseDtoSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
});

export type SignInUserResponseDto = z.infer<typeof signInUserResponseDtoSchema>;
