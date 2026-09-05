import { z } from "zod";

const createProjectSchema = z.object({
  name: z
    .string({ error: "Project name is required" })
    .min(2, "Name must be at least 2 characters"),

  description: z.string().optional(),

  organizationId: z
    .string({ error: "Organization ID is required" })
    .uuid("Invalid organization ID"),

  deadline: z.coerce.date().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(2).optional(),

  description: z.string().optional(),

  status: z
    .enum(["ACTIVE", "ARCHIVED", "COMPLETED"])
    .optional(),

  deadline: z.coerce.date().optional(),
});

export const ProjectValidation = {
  createProjectSchema,
  updateProjectSchema,
};