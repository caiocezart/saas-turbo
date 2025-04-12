import { z } from "zod";
import { Roles, rolesSchema } from "@/auth";

export const membershipInviteSchema = z.object({
  id: z.string().cuid(),
  organizationId: z.string().cuid(),
  memberId: z.string().cuid(),
  role: rolesSchema.default(Roles.USER),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  inviterId: z.string().cuid(),
  acceptedAt: z.coerce.date().nullish(),
});

export type MembershipInviteSchema = z.infer<typeof membershipInviteSchema>;

// export const membershipInviteWithRelationsSchema =
//   membershipInviteSchema.extend({
//     organization: z.lazy(() => organizationSchema.partial()),
//     inviter: z.lazy(() => userSchema.partial()),
//     member: z.lazy(() => userSchema.partial()),
//   });

// export type MembershipInviteWithRelationsSchema = z.infer<
//   typeof membershipInviteWithRelationsSchema
// >;

// export type MembershipInviteUpdateSchema = Partial<MembershipInviteSchema>;
