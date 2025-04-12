import { z } from "zod";

export enum PrismaProviderType {
  PASSWORD = "PASSWORD",
}

export const prismaProviderTypeSchema = z.nativeEnum(PrismaProviderType);
