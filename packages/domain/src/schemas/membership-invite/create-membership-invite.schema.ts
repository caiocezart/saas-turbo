import { z } from "zod";
import { prismaRolesSchema } from "@/enums/role.enum";

export const createMembershipInviteSchema = z.object({
  organizationId: z.string().cuid({ message: "Invalid organization ID" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: prismaRolesSchema,
});

export type CreateMembershipInvite = z.infer<
  typeof createMembershipInviteSchema
>;
