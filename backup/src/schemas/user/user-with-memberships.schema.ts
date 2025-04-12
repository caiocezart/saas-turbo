import { z } from "zod";
import { membershipSchema } from "@/entities/membership.entity";
import { userSchema } from "@/entities/user.entity";

export const userWithMembershipsSchema = userSchema
  .partial({
    id: true,
  })
  .extend({
    memberships: z.array(membershipSchema),
  });

export type UserWithMemberships = z.infer<typeof userWithMembershipsSchema>;
