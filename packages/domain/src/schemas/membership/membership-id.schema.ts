import { z } from "zod";

export const membershipIdSchema = z.object({
  membershipId: z.string().cuid({ message: "Invalid membership ID" }),
});

export type MembershipIdParam = z.infer<typeof membershipIdSchema>;
