import { z } from "zod";
import { membershipSchema } from "@/entities";

export const updateMembershipDtoSchema = membershipSchema.partial();

export type UpdateMembershipDto = z.infer<typeof updateMembershipDtoSchema>;
