import { z } from "zod";
import { membershipSchema } from "@/entities";

export const listMembershipsDtoSchema = membershipSchema.pick({
  id: true,
  organizationId: true,
  memberId: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});

export type ListMembershipsDto = z.infer<typeof listMembershipsDtoSchema>;
