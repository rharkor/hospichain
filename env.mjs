import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    PASSWORD_HASHER_SECRET: z.string().min(16),
    JWT_SECRET: z.string().min(16),
    DATABASE_PRISMA_URL: z.string().min(1),
    DATABASE_URL_NON_POOLING: z.string().optional(),
    NEXTAUTH_SECRET: z.string().min(16),
    NEXTAUTH_URL: z.string().optional(),
    AUTH_ADMIN_EMAIL: z.string().min(1),
    AUTH_ADMIN_PASSWORD: z.string().min(1),
    REDIS_HOST: z.string().optional(),
    REDIS_PORT: z
      .string()
      .optional()
      .transform((value) => parseInt(value)),
    REDIS_USERNAME: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_USE_TLS: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    ENV: z.enum(["development", "recette", "production"]).optional(),
    BASE_URL: z.string().url().optional(),
    VERCEL_URL: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z
      .string()
      .transform((value) => parseInt(value))
      .optional(),
    SMTP_USERNAME: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    SMTP_FROM_NAME: z.string().optional(),
    SMTP_FROM_EMAIL: z.string().optional(),
    SUPPORT_EMAIL: z.string().optional(),
    ENABLE_MAILING_SERVICE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    AWS_REGION: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    ENABLE_S3_SERVICE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
  },
  client: {
    NEXT_PUBLIC_IS_DEMO: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    NEXT_PUBLIC_DEMO_EMAIL: z.string().optional(),
    NEXT_PUBLIC_DEMO_PASSWORD: z.string().optional(),
    NEXT_PUBLIC_AWS_ENDPOINT: z.string().optional(),
    NEXT_PUBLIC_AWS_BUCKET_NAME: z.string().optional(),
    NEXT_PUBLIC_ROLE_MANAGER: z.string().min(1),
    NEXT_PUBLIC_PATIENTS: z.string().min(1),
  },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    PASSWORD_HASHER_SECRET: process.env.PASSWORD_HASHER_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_PRISMA_URL: process.env.DATABASE_PRISMA_URL,
    DATABASE_URL_NON_POOLING: process.env.DATABASE_URL_NON_POOLING,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_ADMIN_EMAIL: process.env.AUTH_ADMIN_EMAIL,
    AUTH_ADMIN_PASSWORD: process.env.AUTH_ADMIN_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_TLS: process.env.REDIS_TLS,
    REDIS_USE_TLS: process.env.REDIS_USE_TLS,
    NEXT_PUBLIC_IS_DEMO: process.env.NEXT_PUBLIC_IS_DEMO,
    NEXT_PUBLIC_DEMO_EMAIL: process.env.NEXT_PUBLIC_DEMO_EMAIL,
    NEXT_PUBLIC_DEMO_PASSWORD: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
    ENV: process.env.ENV,
    BASE_URL: process.env.BASE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    ENABLE_MAILING_SERVICE: process.env.ENABLE_MAILING_SERVICE,
    AWS_REGION: process.env.AWS_REGION,
    NEXT_PUBLIC_AWS_BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    NEXT_PUBLIC_AWS_ENDPOINT: process.env.NEXT_PUBLIC_AWS_ENDPOINT,
    ENABLE_S3_SERVICE: process.env.ENABLE_S3_SERVICE,
    NEXT_PUBLIC_ROLE_MANAGER: process.env.NEXT_PUBLIC_ROLE_MANAGER,
    NEXT_PUBLIC_PATIENTS: process.env.NEXT_PUBLIC_PATIENTS,
  },
  onValidationError: (error) => {
    console.error(error)
    throw error
  },
})
