import { z } from "zod";

const createPaymentSchema = z.object({
  organizationId: z
    .string({ error: "Organization ID is required" })
    .uuid("Invalid organization ID"),

  subscriptionId: z
    .string({ error: "Subscription ID is required" })
    .uuid("Invalid subscription ID"),

  plan: z.enum(["FREE", "PRO", "BUSINESS"], {
    error: "Invalid subscription plan",
  }),

  amount: z
    .number({ error: "Amount is required" })
    .positive("Amount must be greater than 0"),

  currency: z
    .string()
    .length(3, "Currency must be 3 characters")
    .default("BDT"),
});

export const PaymentValidation = {
  createPaymentSchema,
};