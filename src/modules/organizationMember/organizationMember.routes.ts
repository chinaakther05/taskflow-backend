import { Router } from "express";

import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";

import { OrganizationMemberController } from "./organizationMember.controller";
import { OrganizationMemberValidation } from "./organizationMember.validation";

const router = Router();

router.post(
  "/",
  auth,
  validateRequest(
    OrganizationMemberValidation.addMemberSchema,
  ),
  OrganizationMemberController.addMember,
);

router.get(
  "/:organizationId",
  auth,
  OrganizationMemberController.getOrganizationMembers,
);

router.patch(
  "/:memberId/role",
  auth,
  validateRequest(
    OrganizationMemberValidation.updateMemberRoleSchema,
  ),
  OrganizationMemberController.updateMemberRole,
);

router.delete(
  "/:memberId",
  auth,
  OrganizationMemberController.removeMember,
);

export const organizationMemberRoutes = router;