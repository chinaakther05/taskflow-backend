
import { Router } from "express";

import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";

import { ProjectController } from "./project.controller";
import { ProjectValidation } from "./project.validation";

const router = Router();


router.post(
  "/",
  auth,
  validateRequest(ProjectValidation.createProjectSchema),
  ProjectController.createProject,
);

// Get Projects By Organization
router.get(
  "/organization/:organizationId",
  auth,
  ProjectController.getProjectsByOrganization,
);

// Get Project By ID
router.get(
  "/:projectId",
  auth,
  ProjectController.getProjectById,
);


router.patch(
  "/:projectId",
  auth,
  validateRequest(ProjectValidation.updateProjectSchema),
  ProjectController.updateProject,
);


router.delete(
  "/:projectId",
  auth,
  ProjectController.deleteProject,
);

export const projectRouters = router;
