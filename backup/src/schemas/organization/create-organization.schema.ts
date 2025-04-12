import { z } from "zod";
import { organizationSchema } from "@/entities/organization.entity";

export const createOrganizationSchema = organizationSchema.pick({
  name: true,
});

export type CreateOrganization = z.infer<typeof createOrganizationSchema>;
