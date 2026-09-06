import { Router } from "express";
import auth from "../../middlewares/auth.middleware";

import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";
import validateRequest from "../../middlewares/validate.middleware";

const router = Router();

// Create Payment
router.post(
  "/",
  auth,
  validateRequest(PaymentValidation.createPaymentSchema),
  PaymentController.createPayment,
);

// Confirm Payment
router.patch(
  "/confirm/:transactionId",
  auth,
  PaymentController.confirmPayment,
);



// Get My Payments
router.get(
  "/my-payments",
  auth,
  PaymentController.getMyPayments,
);

// Get Payment By ID
router.get(
  "/:paymentId",
  auth,
  PaymentController.getPaymentById,
);

export const PaymentRoutes = router;