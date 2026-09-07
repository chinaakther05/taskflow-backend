import { Router } from "express";
import auth from "../../middlewares/auth.middleware";

import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";
import validateRequest from "../../middlewares/validate.middleware";

const router = Router();


router.post(
  "/",
  auth,
  validateRequest(PaymentValidation.createPaymentSchema),
  PaymentController.createPayment,
);


router.patch(
  "/confirm/:transactionId",
  auth,
  PaymentController.confirmPayment,
);




router.get(
  "/my-payments",
  auth,
  PaymentController.getMyPayments,
);


router.get(
  "/:paymentId",
  auth,
  PaymentController.getPaymentById,
);

export const PaymentRoutes = router;