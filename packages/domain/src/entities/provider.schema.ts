import { z } from "zod";
import { providerTypesSchema } from "@/auth";
export const providerSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  type: providerTypesSchema,
});

export type ProviderSchema = z.infer<typeof providerSchema>;

// export const providerWithAccountsSchema = providerSchema.extend({
//   accounts: z.array(z.lazy(() => accountSchema.partial())),
// });

// export type ProviderWithAccounts = z.infer<typeof providerWithAccountsSchema>;
