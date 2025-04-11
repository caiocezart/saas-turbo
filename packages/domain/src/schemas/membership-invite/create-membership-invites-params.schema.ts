import { PrismaRoles } from "@/enums";
import { z } from "zod";

export const createMembershipInvitesParamsSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(PrismaRoles),
});

export type CreateMembershipInvitesParams = z.infer<
  typeof createMembershipInvitesParamsSchema
>;
