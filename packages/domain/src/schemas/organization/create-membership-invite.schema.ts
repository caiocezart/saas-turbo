import { z } from "zod";
import { prismaRolesSchema } from "@/enums";

export const createMembershipInviteSchema = z.object({
  organizationId: z.string().cuid(),
  memberId: z.string().cuid(),
  role: prismaRolesSchema,
});

export type CreateMembershipInvite = z.infer<
  typeof createMembershipInviteSchema
>;
