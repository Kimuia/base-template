import { z } from 'zod';

const envSchema = z.object({
  // 서버 전용
  DATABASE_URL: z.url().optional(),
  AUTH_SECRET: z.string().min(1).optional(),

  // 클라이언트 공개
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

export type Env = z.infer<typeof envSchema>;
