import { z } from "zod";
import { PrismaRoles, prismaRolesSchema } from "@/enums";
import { organizationSchema } from "./organization.entity";
import { userSchema } from "./user.entity";

export const membershipSchema = z.object({
  id: z.string().cuid(),
  organizationId: z.string().cuid().nullish(),
  memberId: z.string().cuid(),
  role: prismaRolesSchema.default(PrismaRoles.USER),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Membership = z.infer<typeof membershipSchema>;

export const membershipWithRelationsSchema = membershipSchema.extend({
  organization: z.lazy(() => organizationSchema.partial()),
  user: z.lazy(() => userSchema.partial()),
});

export type MembershipWithRelations = z.infer<
  typeof membershipWithRelationsSchema
>;

export type MembershipUpdate = Partial<Membership>;
