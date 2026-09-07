import { Router } from "express";

import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";

import { TaskController } from "./task.controller";
import { TaskValidation } from "./task.validation";

const router = Router();


router.post(
  "/",
  auth,
  validateRequest(TaskValidation.createTaskSchema),
  TaskController.createTask,
);


router.get(
  "/project/:projectId",
  auth,
  TaskController.getTasksByProject,
);


router.get(
  "/:taskId",
  auth,
  TaskController.getTaskById,
);


router.patch(
  "/:taskId",
  auth,
  validateRequest(TaskValidation.updateTaskSchema),
  TaskController.updateTask,
);


router.delete(
  "/:taskId",
  auth,
  TaskController.deleteTask,
);

export const TaskRoutes = router;