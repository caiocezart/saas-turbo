import { z } from "zod";

export enum ProviderTypes {
  PASSWORD = "PASSWORD",
}

export const providerTypesSchema = z.nativeEnum(ProviderTypes);
