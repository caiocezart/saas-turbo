import { z } from "zod";
import { prismaRolesSchema } from "@/enums/role.enum"; // Assuming roles are defined here

export const updateMembershipSchema = z.object({
  role: prismaRolesSchema, // Only allow updating the role
});

export type UpdateMembership = z.infer<typeof updateMembershipSchema>;
