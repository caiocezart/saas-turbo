import { z } from "zod";
export const membershipInviteCreatedEventSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  organizationName: z.string(),
  role: z.string(),
  inviteUrl: z.string(),
});

export type MembershipInviteCreatedEvent = z.infer<
  typeof membershipInviteCreatedEventSchema
>;
