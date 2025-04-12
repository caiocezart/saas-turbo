import { z } from "zod";

// Define possible statuses for invites if needed
// export enum InviteStatus { PENDING = 'pending', ACCEPTED = 'accepted', REVOKED = 'revoked' }
// export const inviteStatusSchema = z.nativeEnum(InviteStatus);

export const listMembershipInvitesDtoSchema = z.object({
  organizationId: z
    .string()
    .cuid({ message: "Invalid organization ID" })
    .optional(),
  // status: inviteStatusSchema.optional(), // Add status filter later if needed
  // Add other potential filters like userId (invitee) later if needed
});

export type ListMembershipInvitesDto = z.infer<
  typeof listMembershipInvitesDtoSchema
>;
