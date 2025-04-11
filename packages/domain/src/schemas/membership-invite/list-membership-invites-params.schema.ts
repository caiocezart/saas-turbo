import { z } from "zod";

export const listMembershipInvitesParamsSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected"]),
});

export type ListMembershipInvitesParams = z.infer<
  typeof listMembershipInvitesParamsSchema
>;
