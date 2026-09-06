import { z } from "zod";

const createAttachmentSchema = z.object({
  taskId: z
    .string({ error: "Task ID is required" })
    .uuid("Invalid task ID"),

  fileUrl: z
    .string({ error: "File URL is required" })
    .url("Invalid file URL"),

  fileName: z
    .string({ error: "File name is required" })
    .min(1, "File name cannot be empty")
    .max(255, "File name must not exceed 255 characters"),

  fileType: z
    .string()
    .max(100, "File type must not exceed 100 characters")
    .optional(),
});

export const AttachmentValidation = {
  createAttachmentSchema,
};