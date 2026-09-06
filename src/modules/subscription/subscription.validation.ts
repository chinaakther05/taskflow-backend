import { z } from "zod";

const createSubscriptionSchema = z.object({
  organizationId: z
    .string({ error: "Organization ID is required" })
    .uuid("Invalid organization ID"),

  plan: z.enum(["FREE", "PRO", "BUSINESS"]).default("FREE"),
});

const updateSubscriptionSchema = z.object({
  plan: z.enum(["FREE", "PRO", "BUSINESS"]).optional(),

  maxProjects: z
    .number()
    .int()
    .positive()
    .optional(),

  maxMembers: z
    .number()
    .int()
    .positive()
    .optional(),
});

export const SubscriptionValidation = {
  createSubscriptionSchema,
  updateSubscriptionSchema,
};