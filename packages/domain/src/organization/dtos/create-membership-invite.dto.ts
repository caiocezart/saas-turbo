import { z } from "zod";
import { rolesSchema } from "@/auth";

export const createMembershipInviteDtoSchema = z.object({
  organizationId: z.string().cuid({ message: "Invalid organization ID" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: rolesSchema,
});

export type CreateMembershipInviteDto = z.infer<
  typeof createMembershipInviteDtoSchema
>;
