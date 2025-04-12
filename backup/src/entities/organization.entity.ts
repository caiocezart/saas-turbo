import { z } from "zod";
import { membershipSchema } from "./membership.entity";

export const organizationSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  timezone: z.string().default("UTC"),
  defaultLanguage: z.string().default("en"),
  settings: z.any().nullish(),
  customDomain: z.string().nullish(),
  logo: z.string().nullish(),
  primaryColor: z.string().nullish(),
  accentColor: z.string().nullish(),
});

export type Organization = z.infer<typeof organizationSchema>;

export const organizationWithMembershipsSchema = organizationSchema.extend({
  memberships: z.array(z.lazy(() => membershipSchema.partial())),
});

export type OrganizationWithMemberships = z.infer<
  typeof organizationWithMembershipsSchema
>;

export type OrganizationUpdate = Partial<Organization>;
