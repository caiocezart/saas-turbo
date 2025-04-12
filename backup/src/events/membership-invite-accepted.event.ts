import { z } from "zod";

export const membershipInviteAcceptedEventSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  organizationName: z.string(),
  role: z.string(),
});

export type MembershipInviteAcceptedEvent = z.infer<
  typeof membershipInviteAcceptedEventSchema
>;
