import { z } from "zod";

export const passwordUpdatedEventSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type PasswordUpdatedEvent = z.infer<typeof passwordUpdatedEventSchema>;
