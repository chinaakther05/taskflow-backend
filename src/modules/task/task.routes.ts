import { Router } from "express";

import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";

import { TaskController } from "./task.controller";
import { TaskValidation } from "./task.validation";

const router = Router();

// Create Task
router.post(
  "/",
  auth,
  validateRequest(TaskValidation.createTaskSchema),
  TaskController.createTask,
);

// Get Tasks By Project
router.get(
  "/project/:projectId",
  auth,
  TaskController.getTasksByProject,
);

// Get Task By ID
router.get(
  "/:taskId",
  auth,
  TaskController.getTaskById,
);

// Update Task
router.patch(
  "/:taskId",
  auth,
  validateRequest(TaskValidation.updateTaskSchema),
  TaskController.updateTask,
);

// Delete Task
router.delete(
  "/:taskId",
  auth,
  TaskController.deleteTask,
);

export const TaskRoutes = router;