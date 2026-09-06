import { z } from "zod";

const createActivitySchema = z.object({
  action: z
    .string({ error: "Activity action is required" })
    .min(1, "Activity action cannot be empty")
    .max(100, "Activity action must not exceed 100 characters"),

  details: z
    .string()
    .max(500, "Activity details must not exceed 500 characters")
    .optional(),

  organizationId: z
    .string({ error: "Organization ID is required" })
    .uuid("Invalid organization ID"),

  projectId: z
    .string({ error: "Project ID is required" })
    .uuid("Invalid project ID"),

  taskId: z
    .string({ error: "Task ID is required" })
    .uuid("Invalid task ID"),
});

export const ActivityValidation = {
  createActivitySchema,
};