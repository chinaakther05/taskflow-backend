import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionValidation } from "./subscription.validation";

const router = Router();

// Create Subscription
router.post(
  "/",
  auth,
  validateRequest(
    SubscriptionValidation.createSubscriptionSchema,
  ),
  SubscriptionController.createSubscription,
);

// Get Subscription
router.get(
  "/:organizationId",
  auth,
  SubscriptionController.getSubscription,
);

// Update Subscription
router.patch(
  "/:subscriptionId",
  auth,
  validateRequest(
    SubscriptionValidation.updateSubscriptionSchema,
  ),
  SubscriptionController.updateSubscription,
);

// Cancel Subscription
router.patch(
  "/:subscriptionId/cancel",
  auth,
  SubscriptionController.cancelSubscription,
);

export const SubscriptionRoutes = router;