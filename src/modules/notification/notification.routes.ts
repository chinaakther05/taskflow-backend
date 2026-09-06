import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";
import { NotificationController } from "./notification.controller";
import { NotificationValidation } from "./notification.validation";

const router = Router();

router.post(
  "/",
  auth,
  validateRequest(NotificationValidation.createNotificationSchema),
  NotificationController.createNotification,
);

router.get(
  "/my/:organizationId",
  auth,
  NotificationController.getMyNotifications,
);

router.get(
  "/:notificationId",
  auth,
  NotificationController.getNotificationById,
);

router.patch(
  "/:notificationId/read",
  auth,
  NotificationController.markAsRead,
);

export const NotificationRoutes = router;