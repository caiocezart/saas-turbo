import { z } from "zod";

export const signOutUserSchema = z.object({
  ok: z.boolean(),
});

export type SignOutUserResponse = z.infer<typeof signOutUserSchema>;
