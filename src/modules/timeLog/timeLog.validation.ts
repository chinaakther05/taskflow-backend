import { z } from "zod";

const createTimeLogSchema = z.object({
  taskId: z
    .string({ error: "Task ID is required" })
    .uuid("Invalid task ID"),

  startTime: z.coerce.date({
    error: "Start time is required",
  }),

  endTime: z.coerce.date().optional(),

  duration: z
    .number()
    .int("Duration must be an integer")
    .positive("Duration must be greater than 0")
    .optional(),

  note: z
    .string()
    .max(500, "Note must not exceed 500 characters")
    .optional(),
});

const updateTimeLogSchema = z.object({
  startTime: z.coerce.date().optional(),

  endTime: z.coerce.date().optional(),

  duration: z
    .number()
    .int("Duration must be an integer")
    .positive("Duration must be greater than 0")
    .optional(),

  note: z
    .string()
    .max(500, "Note must not exceed 500 characters")
    .optional(),
});

export const TimeLogValidation = {
  createTimeLogSchema,
  updateTimeLogSchema,
};