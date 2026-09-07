import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";
import { ActivityController } from "./activity.controller";
import { ActivityValidation } from "./activity.validation";

const router = Router();

router.post("/",auth,validateRequest(ActivityValidation.createActivitySchema),ActivityController.createActivity,
);

router.get("/organization/:organizationId", auth,ActivityController.getActivitiesByOrganization,
);

router.get("/task/:taskId",auth, ActivityController.getActivitiesByTask,);

router.get("/:activityId",auth,ActivityController.getActivityById,
);

export const ActivityRoutes = router;