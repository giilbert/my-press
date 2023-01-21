import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
});
