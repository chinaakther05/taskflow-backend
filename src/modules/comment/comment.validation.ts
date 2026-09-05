import { z } from "zod";

const createCommentSchema = z.object({
  content: z
    .string({ error: "Comment content is required" })
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must not exceed 1000 characters"),

  taskId: z
    .string({ error: "Task ID is required" })
    .uuid("Invalid task ID"),
});

const updateCommentSchema = z.object({
  content: z
    .string({ error: "Comment content is required" })
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must not exceed 1000 characters"),
});

export const CommentValidation = {
  createCommentSchema,
  updateCommentSchema,
};