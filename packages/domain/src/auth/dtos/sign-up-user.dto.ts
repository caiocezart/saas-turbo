import { z } from "zod";
import { providerTypesSchema } from "@/auth";

export const signUpUserRequestDtoSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(8),
  providerType: providerTypesSchema,
});

export type SignUpUserRequestDto = z.infer<typeof signUpUserRequestDtoSchema>;

export const signUpResponseDtoSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
});

export type SignUpResponseDto = z.infer<typeof signUpResponseDtoSchema>;
