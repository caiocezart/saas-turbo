import { z } from "zod";

export const listMembershipsSchema = z.object({
  organizationId: z
    .string()
    .cuid({ message: "Invalid organization ID" })
    .optional(),
  userId: z.string().cuid({ message: "Invalid user ID" }).optional(),
  // Add other potential filters like role, status etc. later if needed
});

export type ListMembershipsQuery = z.infer<typeof listMembershipsSchema>;
