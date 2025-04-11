import { z } from "zod";

export const caslUserSchema = z.object({
  __typename: z.literal("User"),
  id: z.string(),
  email: z.string(),
  role: z.string(),
});

export type CaslUser = z.infer<typeof caslUserSchema>;
