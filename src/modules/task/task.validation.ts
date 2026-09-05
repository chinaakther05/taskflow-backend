import { z } from "zod";

const createTaskSchema = z.object({
  title: z
    .string({ error: "Task title is required" })
    .min(2, "Task title must be at least 2 characters")
    .max(200, "Task title must not exceed 200 characters"),

  description: z.string().optional(),

  projectId: z
    .string({ error: "Project ID is required" })
    .uuid("Invalid project ID"),

  assigneeId: z
    .string()
    .uuid("Invalid assignee ID")
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .default("MEDIUM"),

  deadline: z.coerce.date().optional(),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(2, "Task title must be at least 2 characters")
    .max(200, "Task title must not exceed 200 characters")
    .optional(),

  description: z.string().optional(),

  status: z
    .enum([
      "PENDING_ACCEPTANCE",
      "TODO",
      "IN_PROGRESS",
      "IN_REVIEW",
      "DONE",
    ])
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .optional(),

  assigneeId: z
    .string()
    .uuid("Invalid assignee ID")
    .nullable()
    .optional(),

  deadline: z.coerce.date().nullable().optional(),
});

export const TaskValidation = {
  createTaskSchema,
  updateTaskSchema,
};