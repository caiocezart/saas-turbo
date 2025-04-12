import { z } from "zod";
import { organizationSchema } from "@/entities";

export const updateOrganizationDtoSchema = organizationSchema.partial();

export type UpdateOrganizationDto = z.infer<typeof updateOrganizationDtoSchema>;
