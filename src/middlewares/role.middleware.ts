import { NextFunction, Request, Response } from "express";

import { prisma } from "../lib/prisma";
import sendResponse from "../utils/apiResponse";

import type { Role } from "../../prisma/generated/prisma/client";

const roleMiddleware = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Authentication required",
          data: [],
        });
      }

    const organizationId =
  req.body?.organizationId ||
  req.params?.id ||              
  req.params?.organizationId ||  
  req.headers["x-organization-id"];

      if (!organizationId || typeof organizationId !== "string") {
        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "Organization ID is required",
          data: [],
        });
      }

      const membership = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: String(userId),
            organizationId,
          },
        },
      });

      if (!membership) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "You are not a member of this organization",
          data: [],
        });
      }

      if (!allowedRoles.includes(membership.role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "You do not have permission to perform this action",
          data: [],
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default roleMiddleware;