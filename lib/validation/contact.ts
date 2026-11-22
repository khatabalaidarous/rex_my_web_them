import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(20).max(2000),
  website: z.string().max(200).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
