import { z } from "zod";
import { organizationSchema } from "@/entities";

export const createOrganizationDtoSchema = organizationSchema.pick({
  name: true,
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationDtoSchema>;
