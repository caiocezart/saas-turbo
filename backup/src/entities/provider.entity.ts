import { z } from "zod";
import { accountSchema } from "./account.entity";
import { prismaProviderTypeSchema } from "@/enums";
export const providerSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  type: prismaProviderTypeSchema,
});

export type Provider = z.infer<typeof providerSchema>;

export const providerWithAccountsSchema = providerSchema.extend({
  accounts: z.array(z.lazy(() => accountSchema.partial())),
});

export type ProviderWithAccounts = z.infer<typeof providerWithAccountsSchema>;
