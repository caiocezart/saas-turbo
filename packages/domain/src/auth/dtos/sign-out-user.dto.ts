import { z } from "zod";

export const signOutUserResponseDtoSchema = z.object({
  ok: z.boolean(),
});

export type SignOutUserResponseDto = z.infer<
  typeof signOutUserResponseDtoSchema
>;
