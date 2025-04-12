import { z } from "zod";
import { Roles, rolesSchema } from "@/auth";

export const membershipSchema = z.object({
  id: z.string().cuid(),
  organizationId: z.string().cuid().nullish(),
  memberId: z.string().cuid(),
  role: rolesSchema.default(Roles.USER),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type MembershipSchema = z.infer<typeof membershipSchema>;

// export const membershipWithRelationsSchema = membershipSchema.extend({
//   organization: z.lazy(() => organizationSchema.partial()),
//   user: z.lazy(() => userSchema.partial()),
// });
