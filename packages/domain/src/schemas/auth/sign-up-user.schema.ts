import { z } from "zod";
import { userSchema } from "@/entities/user.entity";
import { prismaProviderTypeSchema } from "@/enums/provider-type.enum";

export const signUpUserSchema = userSchema
  .pick({
    email: true,
    firstName: true,
    lastName: true,
  })
  .extend({
    password: z.string().min(8),
    providerType: prismaProviderTypeSchema,
  });

export type SignUpUser = z.infer<typeof signUpUserSchema>;

export const signUpResponseSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
});

export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
