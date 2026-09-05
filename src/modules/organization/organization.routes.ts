import { Router } from "express";

import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";

import { OrganizationController } from "./organization.controller";
import { OrganizationValidation } from "./organization.validation";
import roleMiddleware from "../../middlewares/role.middleware";

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


router.patch(
  "/:id",
  auth,
  roleMiddleware("ADMIN"), // ✅ checkOrgRole থেকে roleMiddleware তে বদলানো হলো
  validateRequest(OrganizationValidation.updateOrganizationSchema),
  OrganizationController.updateOrganization
);

router.delete(
  "/:id",
  auth,
  roleMiddleware("ADMIN"), // ✅ এখানেও
  OrganizationController.deleteOrganization
);


export const organizationRoutes = router;