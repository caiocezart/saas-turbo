import { verificationActionsSchema } from "@/auth";
import { verificationMethodsSchema } from "@/auth";
import { z } from "zod";

export const otpRequestRequestDtoSchema = z.object({
  action: verificationActionsSchema,
  method: verificationMethodsSchema,
});

export type OtpRequestRequestDto = z.infer<typeof otpRequestRequestDtoSchema>;
