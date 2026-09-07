import { Router } from "express";

import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";

import { OrganizationController } from "./organization.controller";
import { OrganizationValidation } from "./organization.validation";
import roleMiddleware from "../../middlewares/role.middleware";

const router = Router();

router.post("/",
auth,
  validateRequest(OrganizationValidation.createOrganizationSchema),
  OrganizationController.createOrganization,
);

router.get(
  "/",
  auth,
  OrganizationController.getMyOrganizations,
);

router.get(
  "/:id",
  auth,
  OrganizationController.getOrganizationById,
);


router.patch(
  "/:id",
  auth,
  roleMiddleware("ADMIN"), 
  validateRequest(OrganizationValidation.updateOrganizationSchema),
  OrganizationController.updateOrganization
);

router.delete(
  "/:id",
  auth,
  roleMiddleware("ADMIN"), 
  OrganizationController.deleteOrganization
);


router.post(
  "/:organizationId/invite",
  auth,
  validateRequest(OrganizationValidation.inviteMemberSchema),
  roleMiddleware("ADMIN", "PROJECT_MANAGER"),
  OrganizationController.inviteMember,
);

// Remove Member
router.delete(
  "/:organizationId/members/:memberUserId",
  auth,
  roleMiddleware("ADMIN", "PROJECT_MANAGER"),
  OrganizationController.removeMember,
);


export const organizationRoutes = router;