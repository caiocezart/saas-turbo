import { z } from "zod";
import { organizationSchema } from "@/entities/organization.entity";

export const updateOrganizationSchema = organizationSchema.partial();

export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>;
