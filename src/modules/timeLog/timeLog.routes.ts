import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";
import { TimeLogController } from "./timeLog.controller";
import { TimeLogValidation } from "./timeLog.validation";

const router = Router();

router.post(
  "/",
  auth,
  validateRequest(TimeLogValidation.createTimeLogSchema),
  TimeLogController.createTimeLog,
);

router.get(
  "/task/:taskId",
  auth,
  TimeLogController.getTimeLogsByTask,
);

router.get(
  "/:timeLogId",
  auth,
  TimeLogController.getTimeLogById,
);

router.patch(
  "/:timeLogId",
  auth,
  validateRequest(TimeLogValidation.updateTimeLogSchema),
  TimeLogController.updateTimeLog,
);

router.delete(
  "/:timeLogId",
  auth,
  TimeLogController.deleteTimeLog,
);

export const TimeLogRoutes = router;