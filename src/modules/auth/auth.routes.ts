import { Router } from "express";
import validateRequest from "../../middlewares/validate.middleware";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidation.RegisterZodSchema),
  AuthController.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidation.LoginZodSchema),
  AuthController.loginUser
);


export const authRoutes = router;