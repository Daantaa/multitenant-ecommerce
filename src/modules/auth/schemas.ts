import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(63, "Username must be at most 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]+$/,
      "Username can only contain letters, numbers"
    )
    .refine(
      (val) => !val.includes("--"),
      "This username cannot contain consecutive hyphens"
    )
    .transform((val) => val.toLowerCase()),
});
