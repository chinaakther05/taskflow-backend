import { Router } from "express";

import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";

import { OrganizationController } from "./organization.controller";
import { OrganizationValidation } from "./organization.validation";

const router = Router();

router.post(
  "/",
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


export const organizationRoutes = router;