import { z } from "zod";

const createOrganizationSchema = z.object({
  name: z
    .string({ error: "Organization name is required" })
    .min(2, "Name must be at least 2 characters"),

  slug: z
    .string({ error: "Slug is required" })
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  logo: z.string().url("Logo must be a valid URL").optional(),

  description: z.string().optional(),
});


const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional(),

  logo: z.string().url("Logo must be a valid URL").optional(),

  description: z.string().optional(),

  isActive: z.boolean().optional(),
});

const inviteMemberSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid email format"),

  role: z
    .enum(["ADMIN", "PROJECT_MANAGER", "MEMBER"])
    .optional(),
});

export const OrganizationValidation = {
  createOrganizationSchema,
  updateOrganizationSchema, 
  inviteMemberSchema,
};




