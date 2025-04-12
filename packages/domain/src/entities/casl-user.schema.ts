import { z } from "zod";
import { rolesSchema } from "@/auth";
export const caslUserSchema = z.object({
  __typename: z.literal("User"),
  id: z.string(),
  email: z.string(),
  role: rolesSchema,
});

export type CaslUserSchema = z.infer<typeof caslUserSchema>;
