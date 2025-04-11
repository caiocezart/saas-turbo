import { z } from "zod";

export const envSchema = z.object({
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
  // Frontend
  FRONTEND_PORT: z.coerce.number(),
  NEXT_PUBLIC_FRONTEND_URL: z.string(),

  // Backend
  BACKEND_PORT: z.coerce.number(),
  BACKEND_URL: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  API_PREFIX: z.string(),
  API_BASE_URL: z.string(),

  // CORS
  CORS_ORIGINS: z.string(),
  COOKIE_SECRET: z.string(),

  // API Rate Limiting
  RATE_LIMIT_TTL: z.coerce.number(),
  RATE_LIMIT_MAX: z.coerce.number(),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().optional(),
  REDIS_DB: z.coerce.number().optional(),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: z.coerce.number(),

  // VERIFICATION
  OTP_SIZE: z.coerce.number(),
  OTP_EXPIRATION_TIME: z.string().default("FIVE_MINUTES"),
  EMAIL_EXPIRATION_TIME: z.string().default("FIFTEEN_MINUTES"),
  EMAIL_VERIFICATION_CODE_SIZE: z.coerce.number().default(15),
  VERIFICATION_CODE_WAIT_TIME: z.string().default("TWO_MINUTES"),
  // JWT
  JWT_ALGORITHM: z.string().default("RS256"),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
