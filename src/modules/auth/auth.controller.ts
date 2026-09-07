import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";
import { AuthService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  // Refresh token
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.googleLogin(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Google login successful",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  googleLogin,
};