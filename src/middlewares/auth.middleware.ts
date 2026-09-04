import { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

import config from "../config";
import { jwtUtils } from "../utils/jwt";
import sendResponse from "../utils/apiResponse";

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Authentication token is required",
        data: [],
      });
    }

    if (!authorization.startsWith("Bearer ")) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid authorization format",
        data: [],
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Authentication token is required",
        data: [],
      });
    }

    const result = jwtUtils.verifyToken(
      token,
      config.jwt_access_secret as string,
    );

    if (!result.success || typeof result.data === "string") {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid or expired token",
        data: [],
      });
    }

    const decoded = result.data as JwtPayload;

    if (!decoded.userId) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid authentication token",
        data: [],
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;