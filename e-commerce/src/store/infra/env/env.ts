import z from "zod";

export const envSchema = z.object({
  PORT : z.coerce.number().default(3333),
  API_CPF_URL : z.url(),
  API_TOKEN_INVERTEXTO : z.string(),
  DATABASE_URL : z.url()
})

export type Env = z.infer<typeof envSchema>