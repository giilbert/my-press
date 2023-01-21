import { z } from "zod";

export const createStreamSchema = z.object({
  name: z.string().min(5),
  slug: z.string().min(5),
});
