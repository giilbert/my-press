import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(5).max(30),
  content: z.string(),
  dueDate: z.date(),
});
