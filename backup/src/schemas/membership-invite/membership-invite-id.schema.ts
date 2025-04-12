import { z } from "zod";

export const membershipInviteIdSchema = z.object({
  inviteId: z.string().cuid({ message: "Invalid invite ID" }),
});

export type MembershipInviteIdParam = z.infer<typeof membershipInviteIdSchema>;
