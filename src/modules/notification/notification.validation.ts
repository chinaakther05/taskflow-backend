import { z } from "zod";

const createNotificationSchema = z.object({
  type: z.enum([
    "TASK_ASSIGNED",
    "TASK_STATUS_CHANGED",
    "TASK_DEADLINE_NEAR",
    "COMMENT_ADDED",
    "MEMBER_ADDED",
    "PROJECT_CREATED",
    "PAYMENT_SUCCESS",
  ]),

  title: z
    .string({ error: "Notification title is required" })
    .min(1, "Notification title cannot be empty")
    .max(200, "Notification title must not exceed 200 characters"),

  message: z
    .string({ error: "Notification message is required" })
    .min(1, "Notification message cannot be empty")
    .max(1000, "Notification message must not exceed 1000 characters"),

  organizationId: z
    .string({ error: "Organization ID is required" })
    .uuid("Invalid organization ID"),

  userId: z
    .string({ error: "User ID is required" })
    .uuid("Invalid user ID"),
});

export const NotificationValidation = {
  createNotificationSchema,
};