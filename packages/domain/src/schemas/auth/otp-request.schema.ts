import { verificationMethodsSchema } from "@/enums";
import { verificationActionsSchema } from "@/enums";
import { z } from "zod";

export const otpRequestSchema = z.object({
  userId: z.string(),
  action: verificationActionsSchema,
  method: verificationMethodsSchema,
});

export type OtpRequest = z.infer<typeof otpRequestSchema>;
