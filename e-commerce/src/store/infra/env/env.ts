import z from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  API_TOKEN_CPF: z.string().min(1),
  API_CPF_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  JWT_PUBLIC_KEY : z.string(),
  JWT_PRIVATE_KEY : z.string()
});


export type Env = z.infer<typeof envSchema>