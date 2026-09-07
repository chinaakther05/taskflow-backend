import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionValidation } from "./subscription.validation";

const router = Router();


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


router.patch(
  "/:subscriptionId",
  auth,
  validateRequest(
    SubscriptionValidation.updateSubscriptionSchema,
  ),
  SubscriptionController.updateSubscription,
);


router.patch(
  "/:subscriptionId/cancel",
  auth,
  SubscriptionController.cancelSubscription,
);

export const SubscriptionRoutes = router;