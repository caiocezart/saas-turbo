import { z } from "zod";

// Assuming the invite token is a simple string for now.
// Could be made more specific (e.g., UUID) if needed.
export const membershipInviteTokenDtoSchema = z.object({
  token: z.string().min(10, { message: "Invalid invite token" }), // Example validation
});

export type MembershipInviteTokenDto = z.infer<
  typeof membershipInviteTokenDtoSchema
>;
