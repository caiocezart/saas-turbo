import { z } from "zod";
import { PrismaRoles, prismaRolesSchema } from "@/enums";
import { organizationSchema } from "./organization.entity";
import { userSchema } from "./user.entity";

export const membershipInviteSchema = z.object({
  id: z.string().cuid(),
  organizationId: z.string().cuid(),
  memberId: z.string().cuid(),
  role: prismaRolesSchema.default(PrismaRoles.USER),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  inviterId: z.string().cuid(),
  acceptedAt: z.coerce.date().nullish(),
});

export type MembershipInvite = z.infer<typeof membershipInviteSchema>;

export const membershipInviteWithRelationsSchema =
  membershipInviteSchema.extend({
    organization: z.lazy(() => organizationSchema.partial()),
    inviter: z.lazy(() => userSchema.partial()),
    member: z.lazy(() => userSchema.partial()),
  });

export type MembershipInviteWithRelations = z.infer<
  typeof membershipInviteWithRelationsSchema
>;

export type MembershipInviteUpdate = Partial<MembershipInvite>;
