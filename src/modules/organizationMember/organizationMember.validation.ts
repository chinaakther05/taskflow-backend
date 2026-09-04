import { z } from "zod";

const addMemberSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  organizationId: z.string().uuid("Invalid organization ID"),
  role: z
    .enum(["PROJECT_MANAGER", "MEMBER"])
    .default("MEMBER"),
});

const updateMemberRoleSchema = z.object({
  role: z.enum(["PROJECT_MANAGER", "MEMBER"]),
});

export const OrganizationMemberValidation = {
  addMemberSchema,
  updateMemberRoleSchema,
};