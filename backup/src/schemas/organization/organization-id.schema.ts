import { z } from "zod";

export const organizationIdSchema = z.object({
  organizationId: z.string().cuid({ message: "Invalid organization ID" }),
});

export type OrganizationIdParam = z.infer<typeof organizationIdSchema>;
